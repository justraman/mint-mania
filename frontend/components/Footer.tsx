import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <Link className="flex items-center text-primary" href="/">
              <Image src="/mania-logo.png" alt="mint-mania-logo" width={36} height={36} className="w-9" />
              <span className="text-4xl ml-2">MINT MANIA</span>
            </Link>
          </div>

          <p className="mt-4 flex gap-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Mint Mania{" "}
            <a href="http://github.com/justraman/mint-mania" target="_blank" rel="noopener noreferrer">
              <Github size={16} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
