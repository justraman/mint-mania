import React from "react";


const tokens = Array.from({ length: 20 }, (v, i) => ({
  id: i + 1,
  name: `Token ${i + 1}`,
  symbol: `SYM${i + 1}`,
  price: `$${(Math.random() * 100).toFixed(2)}`,
  image: "/mint-logo.png",
}));

export default function Tokens() {
  return (
    <>
      <section
        className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10"
        id="services"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4"
        >
          {tokens.map((token) => (
            <article
              key={token.id}
              className="hover:animate-background bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] flex justify-center"
            >
              <div className="bg-black p-4 w-full max-w-[250px]">
                <div className="w-36 h-36 bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-0.5 text-2xl font-medium text-white text-center">
                  {token.name}
                </h3>
                <h3 className="mt-0.5 text-2xl font-medium text-blue-500 text-center">
                  {token.symbol}
                </h3>
                <h3 className="mt-0.5 text-2xl font-medium text-green-500 text-center">
                  {token.price}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
