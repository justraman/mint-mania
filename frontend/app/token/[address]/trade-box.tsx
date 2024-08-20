"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Input } from "@/components/ui/input";
import { useAccount, useReadContract } from "wagmi";
import Erc20Abi from "@/abi/Erc20";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import type { tokens } from "@/db/drizzle/schema";
import BigNumber from "bignumber.js";
import { contractAddresses, usdtContractAddress } from "@/constants";
import { formatUnits, parseUnits } from "viem";
import MintMania from "@/abi/MintMania";
import { readContract, simulateContract, waitForTransactionReceipt, writeContract, WriteContractErrorType } from "@wagmi/core";
import { config } from "@/app/wagmi-config";
import debounce from "lodash/debounce";
import { useToast } from "@/components/ui/use-toast";
import { pusher } from "@/pusher";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function formatUSDT(value: bigint | undefined) {
  if (!value) return "0.0";
  return new BigNumber(value.toString()).shiftedBy(-6).toFixed(2);
}

export default function TradeBox({ token }: { token: typeof tokens.$inferSelect }) {
  const [selectedButton, setSelectedButton] = useState<"buy" | "sell">("buy");
  const { open } = useWeb3Modal();
  const account = useAccount();
  const router = useRouter();

  const { toast } = useToast();
  const usdtBalance = useReadContract({
    abi: Erc20Abi,
    address: usdtContractAddress,
    functionName: "balanceOf",
    args: [account.address ?? "0x"]
  });

  const [error, setError] = React.useState("");
  const [allowanceDialogOpen, setAllowanceDialogOpen] = React.useState(false);
  const [waitingForTransaction, setWaitingForTransaction] = React.useState(false);
  const [estimateTokenValue, setEstimateTokenValue] = useState<bigint | undefined>(undefined);
  const [estimateUsdtValue, setEstimateUsdtValue] = useState<bigint | undefined>(undefined);

  const validation = z.object({
    amount: z.coerce
      .number()
      .nonnegative()
      .min(0.01)
      .max(50000_000_000)
      .refine((value) => !isNaN(value), { message: "Invalid number" })
      .refine((value) => value > 0, { message: "Amount must be greater than 0" })
      .superRefine((value, ctx) => {
        if (selectedButton === "sell") {
          if (!Number.isInteger(value)) {
            return ctx.addIssue({
              message: "Amount must be an integer",
              code: z.ZodIssueCode.custom
            });
          }

          if (tokenBalance.data && BigInt(value) > tokenBalance.data) {
            return ctx.addIssue({
              message: "Insufficient token balance",
              code: z.ZodIssueCode.custom
            });
          }
        } else {
          if (usdtBalance.data && parseUnits(value.toString(), 6) > usdtBalance.data) {
            return ctx.addIssue({
              message: "Insufficient USDT balance",
              code: z.ZodIssueCode.custom
            });
          }
        }
      })
  });

  const form = useForm<z.input<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      amount: undefined
    },
    mode: "all"
  });

  const calculateEstimated = async (amount: number) => {
    if (!token.address) return;

    try {
      if (selectedButton === "buy") {
        const value = parseUnits(amount.toString(), 6);
        const estimate = await readContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "calculateTokenReturn",
          args: [token.address as `0x${string}`, value]
        });
        if (form.formState.errors.amount) return;
        setEstimateTokenValue(estimate);
      } else {
        const value = BigInt(amount);
        const estimate = await readContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "calculateSaleReturn",
          args: [token.address as `0x${string}`, value]
        });
        if (form.formState.errors.amount) return;

        setEstimateUsdtValue(estimate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setEstimateTokenValue(undefined);
    setEstimateUsdtValue(undefined);
    form.clearErrors();
  }, [selectedButton, form]);

  const tokenBalance = useReadContract({
    abi: Erc20Abi,
    address: token.address as `0x${string}`,
    functionName: "balanceOf",
    args: [account.address ?? "0x"]
  });

  const setMax = () => {
    if (selectedButton === "buy" && usdtBalance.data) {
      form.setValue("amount", Number(formatUnits(usdtBalance.data, 6)));
    } else {
      form.setValue("amount", tokenBalance.data ? Number(formatUnits(tokenBalance.data, 0)) : 0);
    }
  };

  const addAllowance = async () => {
    try {
      setError("");
      setWaitingForTransaction(true);
      const { request } = await simulateContract(config, {
        abi: Erc20Abi,
        address: usdtContractAddress,
        functionName: "approve",
        args: [contractAddresses, BigInt(50000_000_000)] // 50k USDT
      });

      const hash = await writeContract(config, request);
      await waitForTransactionReceipt(config, {
        hash
      });
      setWaitingForTransaction(false);
      setAllowanceDialogOpen(false);
    } catch (error: any) {
      let typedError = error as WriteContractErrorType;
      if (typedError.name === "ContractFunctionExecutionError") {
        setError(typedError.shortMessage);
      } else if (typedError.name === "TransactionExecutionError") {
        setError(typedError.details);
      } else {
        setError(error.message);
      }
    } finally {
      setWaitingForTransaction(false);
    }
  };

  const requestAllowance = () => {
    setAllowanceDialogOpen(true);
  };

  const checkAlowance = async (value: bigint) => {
    if (!token.address) return;
    const allowance = await readContract(config, {
      abi: Erc20Abi,
      address: usdtContractAddress,
      functionName: "allowance",
      args: [account.address ?? "0x", contractAddresses]
    });

    if (allowance < value) {
      return false;
    }

    return true;
  };

  const onSubmit = async (values: z.output<typeof validation>) => {
    if (!account.isConnected) return open({ view: "Connect" });
    setError("");
    try {
      setWaitingForTransaction(true);
      if (selectedButton === "buy") {
        const value = parseUnits(values.amount.toString(), 6);
        const hasAllowance = await checkAlowance(value);

        if (!hasAllowance) {
          return requestAllowance();
        }

        const { request } = await simulateContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "buy",
          args: [token.address as `0x${string}`, value]
        });

        const hash = await writeContract(config, request);
        setWaitingForTransaction(false);
        toast({
          title: "Trade placed",
          duration: 5000
        });
        await waitForTransactionReceipt(config, {
          hash
        });

        usdtBalance.refetch();
        tokenBalance.refetch();
      } else {
        const value = BigInt(values.amount);
        const { request } = await simulateContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "sell",
          args: [token.address as `0x${string}`, value]
        });

        const hash = await writeContract(config, request);
        setWaitingForTransaction(false);
        toast({
          title: "Trade placed",
          duration: 5000
        });

        await waitForTransactionReceipt(config, {
          hash
        });

        usdtBalance.refetch();
        tokenBalance.refetch();
      }
    } catch (error: any) {
      let typedError = error as WriteContractErrorType;
      if (typedError.name === "ContractFunctionExecutionError") {
        setError(typedError.shortMessage);
      } else if (typedError.name === "TransactionExecutionError") {
        setError(typedError.details);
      } else {
        setError(error.message);
      }
    } finally {
      setWaitingForTransaction(false);
      setEstimateTokenValue(undefined);
      setEstimateUsdtValue(undefined);
    }
  };

  useEffect(() => {
    var channel = pusher.subscribe(`trades_${token.address}`);
    channel.bind("new-trade", function (data: any) {
      usdtBalance.refetch();
      tokenBalance.refetch();
      router.refresh();
    });

    return () => {
      pusher.unsubscribe("trades");
    };
  }, [router, token.address, tokenBalance, usdtBalance]);

  useEffect(() => {
    var channel = pusher.subscribe(`token`);
    channel.bind("created", function (data: any) {
      router.refresh();
    });

    return () => {
      pusher.unsubscribe("token");
    };
  }, [router]);

  useEffect(() => {
    setEstimateTokenValue(undefined);
    setEstimateUsdtValue(undefined);
    setError("");

    if (form.formState.errors.amount) return;

    const debouncedCalculateEstimated = debounce(calculateEstimated, 1000);
    debouncedCalculateEstimated(form.watch("amount"));
    return debouncedCalculateEstimated.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("amount"), selectedButton]);

  return (
    <>
      <AlertDialog open={allowanceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Allow to spend USDT</AlertDialogTitle>
            <AlertDialogDescription>Before you Buy, You need to allow the contract to spend USDT on your behalf</AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-red-500 text-center mx-auto max-w-56 break-all">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black text-xl rounded-none bg-red-300" onClick={() => setAllowanceDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => addAllowance()}
              className="w-full rounded-none text-center text-2xl cursor-pointer hover:bg-primary text-green-900 transition flex items-center justify-center"
            >
              {waitingForTransaction ? "Waiting for transaction..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full border border-solid border-primary bg-black shadow-2xl relative p-6">
        <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white " />
        <div className="grid gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedButton("buy")}
              className={`p-3 border-[1px] ${
                selectedButton === "buy" ? "bg-primary text-green-900" : "text-primary"
              } w-full text-center text-2xl cursor-pointer hover:bg-primary hover:text-green-900 transition flex items-center justify-center`}
            >
              Buy
            </button>
            <button
              onClick={() => setSelectedButton("sell")}
              className={`p-3 border-[1px] ${
                selectedButton === "sell" ? "bg-red-500 text-white border-red" : "text-primary border-primary"
              } w-full text-center text-2xl cursor-pointer hover:bg-red-500 hover:text-white hover:border-white transition flex items-center justify-center`}
            >
              Sell
            </button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex relative h-10 items-center">
                          <button
                            onClick={setMax}
                            className="!absolute cursor-pointer right-1 top-1 z-10 select-none rounded bg-secondary py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:shadow-none active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:shadow-none"
                            type="button"
                            data-ripple-light="true"
                          >
                            max
                          </button>
                          <Input
                            className="text-black font-bold peer h-full w-full rounded-[7px] border pr-20 font-sans text-sm  outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            placeholder="0.0"
                            type="number"
                            required
                            {...field}
                            max={50000_000_000}
                            step="0.01"
                          />
                          <label className="pointer-events-none absolute right-28  flex w-auto  select-none text-lg pleading-tight text-black ">
                            {selectedButton == "buy" ? "USDT" : token.symbol}
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {estimateTokenValue && (
                    <div className="text-md mt-1 ml-3 font-sans lowercase">
                      {Intl.NumberFormat().format(estimateTokenValue)} <span className="uppercase font-['TheFountainOfWishes']">{token.symbol}</span>
                    </div>
                  )}
                  {estimateUsdtValue && (
                    <div className="text-md mt-1 ml-3 font-sans lowercase">
                      {Intl.NumberFormat().format(Number(estimateUsdtValue) / 1000_000)}{" "}
                      <span className="uppercase font-['TheFountainOfWishes']">USDT</span>
                    </div>
                  )}
                </div>
                {error && <p className="text-red-500 text-center mx-auto max-w-56 break-all">{error}</p>}
                <button
                  type="submit"
                  disabled={token.confirmed === false || waitingForTransaction === true}
                  className="p-3 disabled:bg-gray-300 disabled:border-none disabled:text-black border-[1px] border-primary text-primary w-full text-center text-2xl cursor-pointer hover:bg-primary hover:text-green-900 transition flex items-center justify-center"
                >
                  {token.confirmed === false ? "Token is being indexed..." : "Place Trade"}
                </button>
              </div>
            </form>
          </Form>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>
                USDT Balance: <span className="text-xl ml-4">{formatUSDT(usdtBalance.data)} USDT</span>
              </span>

              <button
                onClick={() =>
                  open({
                    view: "OnRampProviders"
                  })
                }
                className="border px-2"
              >
                BUY USDT <span className="text-xl ml-1">+</span>
              </button>
            </div>
            <div className="flex items-center">
              {token.symbol} Balance:{" "}
              <span className="text-xl ml-4">
                {tokenBalance.data ? formatUnits(tokenBalance.data, 0) : "0"} {token.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
