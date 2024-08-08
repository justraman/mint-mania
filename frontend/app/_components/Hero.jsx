"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function Hero() {
  const [image, setImage] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Token Name:", tokenName);
    console.log("Token Symbol:", tokenSymbol);
  };
  return (
    <section
      className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10"
      id="services"
    >
      <div
        className="grid grid-cols-1 
        sm:grid-cols-1 md:grid-cols-2
        gap-7 mt-4
        lg:grid-cols-3"
      >
        <div className="w-full flex items-center flex-col justify-center  border border-solid border-primary bg-black  p-6 gap-4 shadow-2xl relative">
          <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%]  md:-right-2 md:w-[102%] xs:h-[102%]  bg-white" />
          <h2 className="text-4xl font-bold mb-4 text-center">Create Token</h2>

          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              <div className="w-36 h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">Upload Image</span>
                )}
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block">
              <Input
                className="text-green-900 text-xl"
                type="text"
                placeholder="Token Name"
              />
            </label>

            <label className="block">
              <Input
                className="text-green-900 text-xl"
                type="text"
                placeholder="Token Symbol"
              />
            </label>

            <button
              type="submit"
              className="p-2 px-3 border-[1px] border-primary
    text-primary w-full text-center
    mt-2
    text-lg
    cursor-pointer 
    hover:bg-primary hover:text-green-900"
            >
              Create Token
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
