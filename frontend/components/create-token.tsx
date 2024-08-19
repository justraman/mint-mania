"use client";

import React, { useMemo } from "react";
import z from "zod";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { saveToken } from "@/app/actions";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt, WriteContractErrorType, simulateContract } from "@wagmi/core";
import { writeContracts, getCallsStatus } from "@wagmi/core/experimental";
import MintManiaAbi from "@/abi/MintMania";
import { contractAddresses } from "@/constants";
import { useRouter } from "next/navigation";
import { config } from "@/app/wagmi-config";

const validation = z.object({
  tokenName: z.string().min(3).max(255),
  tokenSymbol: z.string().min(2).max(5),
  /// only allow 5mb images
  image:
    typeof window !== "undefined"
      ? z
          .instanceof(FileList)
          .refine((file) => file?.length == 1, "File is required.")
          .refine((file) => file.length > 0 && file[0].size < 3 * 1024 * 1024, "File size must be less than 3mb")
      : z.any(),
  twitter: z.union([
    z.string().url("invalid twitter").startsWith("https://x.com/").optional(),
    z
      .string()
      .max(0)
      .transform((value) => (value === "" ? undefined : value))
  ]),
  telegram: z.union([
    z.string().url("invalid telegram").startsWith("https://t.me/").optional(),
    z
      .string()
      .max(0)
      .transform((value) => (value === "" ? undefined : value))
  ]),
  discord: z.union([
    z.string().url("invalid discord").startsWith("https://discord.gg/").optional(),
    z
      .string()
      .max(0)
      .transform((value) => (value === "" ? undefined : value))
  ]),
  website: z.union([
    z.string().url("invalid website").startsWith("https://").optional(),
    z
      .string()
      .max(0)
      .transform((value) => (value === "" ? undefined : value))
  ])
});

export default function CreateToken() {
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      image: [] as unknown as FileList,
      twitter: "",
      telegram: "",
      discord: "",
      website: ""
    }
  });

  const { isConnected, connector, address } = useAccount();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const [hasSocials, setHasSocials] = React.useState(false);
  const [waitingForTransaction, setWaitingForTransaction] = React.useState(false);
  const isCoinbaseWallet = useMemo(() => connector?.type === "coinbaseWallet", [connector]);
  const [error, setError] = React.useState("");
  const imageRef = form.register("image");

  const handleSubmit = async (data: z.output<typeof validation>) => {
    if (!isConnected) return open({ view: "Connect" });
    const imageUri = crypto.randomUUID();
    setError("");

    try {
      setWaitingForTransaction(true);
      let hash: `0x${string}`;
      if (isCoinbaseWallet) {
        // pay via paymaster
        const callHash = await writeContracts(config, {
          account: address,
          contracts: [
            {
              abi: MintManiaAbi.abi,
              address: contractAddresses,
              functionName: "create",
              args: [data.tokenName, data.tokenSymbol, imageUri]
            }
          ],
          capabilities: {
            paymasterService: {
              url: process.env.NEXT_PUBLIC_PAYMASTER_URL
            }
          }
        });

        // wait for 5 seconds

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const callStatus = await getCallsStatus(config, {
          id: callHash
        });

        const eventHash = callStatus.receipts?.at(0)?.blockHash;
        if (!eventHash || callStatus.status === "PENDING") {
          throw new Error("eventHash is null or call is still pending");
        }

        hash = eventHash;
      } else {
        const { request } = await simulateContract(config, {
          abi: MintManiaAbi.abi,
          address: contractAddresses,
          functionName: "create",
          args: [data.tokenName, data.tokenSymbol, imageUri]
        });

        hash = await writeContract(config, request);
        await waitForTransactionReceipt(config, {
          hash
        });
      }

      const formData = new FormData();
      formData.append("file", data.image[0]);
      formData.append("data", JSON.stringify({ ...data, image: undefined, imageUri: imageUri, txHash: hash }));
      const token = await saveToken(formData);

      // redirect to token page

      router.push(`/token/${token.id}`);
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

  function getImageUrl() {
    return URL.createObjectURL(form.getValues().image[0]);
  }

  return (
    <>
      <section className="w-full mx-auto px-4 sm:px-6 duration-500 transition-transform lg:px-8" id="services">
        <div className="w-fit mt-4 mx-auto">
          <div className="w-full flex items-center px-16 md:px-28 flex-col justify-center  border border-solid border-primary bg-black  p-6 gap-4 shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%]  md:-right-2 md:w-[102%] xs:h-[102%]  bg-white" />

            <h2 className="text-4xl font-bold mb-4 text-center">Create Token</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex items-center justify-center flex-col md:flex-row gap-8">
                  <div className="flex flex-col justify-center gap-4 ">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex justify-center">
                              <label className="relative cursor-pointer">
                                <input
                                  accept="image/png, image/gif, image/jpeg"
                                  type="file"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  {...imageRef}
                                />
                                <div className="w-40 h-40 bg-gray-200 rounded-none flex items-center justify-center overflow-hidden">
                                  {form.getValues().image?.length > 0 ? (
                                    <Image width={160} height={144} src={getImageUrl()} alt="Uploaded" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-gray-500 text-lg">Upload Image</span>
                                  )}
                                </div>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tokenName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <label className="block">
                              <Input {...field} className="text-green-900 rounded-none text-xl" type="text" placeholder="Token Name" />
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tokenSymbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <label className="block">
                              <Input {...field} className="text-green-900 rounded-none text-xl" type="text" placeholder="Token Symbol" />
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {hasSocials && (
                    <div className="flex flex-col gap-4 ">
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="block">
                                <Input {...field} className="text-green-900 text-xl rounded-none" type="text" placeholder="Twitter" />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telegram"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="block">
                                <Input {...field} className="text-green-900  text-xl rounded-none" type="text" placeholder="Telegram" />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discord"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="block">
                                <Input {...field} className="text-green-900  text-xl rounded-none" type="text" placeholder="Discord" />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="block">
                                <Input {...field} className="text-green-900  text-xl rounded-none" type="text" placeholder="Website" />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="mx-auto mt-4 text-center w-auto">
                  {error && <p className="text-red-500 text-center mx-auto max-w-56 break-all">{error}</p>}
                  <Button
                    type="button"
                    onClick={() => setHasSocials((v) => !v)}
                    className="h-6 w-40 px-0 hover:bg-green-300 mx-auto text-black flex self-center justify-center gap-2"
                  >
                    {hasSocials ? <X size={16} /> : <Plus size={16} />}
                    {hasSocials ? "Hide" : "Add"} Socials
                  </Button>
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={waitingForTransaction}
                      className="p-2 px-14 border-[1px] border-primary text-primary text-center text-lg cursor-pointer hover:bg-primary hover:text-green-900"
                    >
                      {waitingForTransaction ? "Creating Token..." : `Create Token ${isCoinbaseWallet ? "with Zero Gas" : ""}`}
                    </button>
                    {!isCoinbaseWallet && (
                      <button type="button" className="bg-transparent text-yellow-300">
                        Got No ETH? Go Gas-less
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
