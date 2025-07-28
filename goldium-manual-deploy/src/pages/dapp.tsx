import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "../components/Layout";
import { AdvancedDashboard } from "../components/AdvancedDashboard";

const DApp: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>DApp - Goldium.io</title>
        <meta name="description" content="Trade SOL and GOLD tokens, stake for rewards, and manage your DeFi portfolio on Goldium.io" />
      </Head>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Goldium DApp
            </h1>
            <p className="text-xl text-white">
              Trade, swap, and stake SOL for GOLD rewards with lightning-fast transactions
            </p>
          </div>
          
          <AdvancedDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default DApp;