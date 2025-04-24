import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Header } from "@components/layout/header";
import { PageContainer } from "@components/layout/page-container";
import { DrawerContainer } from "@components/layout/drawer-container";
import { Menu } from "@components/layout/menu";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDataFetch } from "@utils/use-data-fetch";
import { Footer } from "@components/layout/footer";
import { APP_DESCRIPTION, APP_NAME } from "@utils/globals";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ListingForm, ListingFormData } from "@components/marketplace/listing-form";
import { ItemData } from "@components/home/item";
import { useRouter } from "next/router";

const CreateListingPage: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data } = useDataFetch<TwitterResponse>(
    connected && publicKey ? `/api/twitter/${publicKey}` : null
  );

  const { data: nfts } = useDataFetch<Array<ItemData>>(
    connected && publicKey ? `/api/items/${publicKey}` : null
  );

  const twitterHandle = data && data.handle;
  
  // Mock NFT data
  const mockNfts = [
    { id: "1", name: "Golden Egg #1234", collection: "Genesis Collection", rarity: "Rare", imageUrl: "/images/nft-1.png" },
    { id: "2", name: "Fire Egg #5678", collection: "Elemental Collection", rarity: "Epic", imageUrl: "/images/nft-2.png" },
    { id: "3", name: "Water Egg #9012", collection: "Elemental Collection", rarity: "Rare", imageUrl: "/images/nft-3.png" },
  ];
  
  const handleCreateListing = async (data: ListingFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to create the listing
      console.log('Creating listing with data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Listing created successfully!');
      
      // Redirect to marketplace
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{APP_NAME} - Create Listing</title>
        <meta
          name="description"
          content="Create a new listing on the Goldium.io marketplace"
        />
      </Head>
      <DrawerContainer>
        <PageContainer>
          <Header twitterHandle={twitterHandle} />
          
          <div className="bg-base-200 p-6 rounded-box mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Create Listing</h1>
                <p>List your NFT on the marketplace to sell for GOLD tokens</p>
              </div>
              
              <Link href="/marketplace" className="btn btn-outline">
                Back to Marketplace
              </Link>
            </div>
            
            {connected ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ListingForm 
                    nfts={nfts || mockNfts}
                    onSubmit={handleCreateListing}
                    isLoading={isSubmitting}
                  />
                </div>
                
                <div>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Listing Information</h2>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="font-bold">Fees</h3>
                          <p className="text-sm">A 2.5% fee will be deducted from the final sale price.</p>
                        </div>
                        
                        <div>
                          <h3 className="font-bold">Duration</h3>
                          <p className="text-sm">Listings can be set for 1, 3, 7, 14, or 30 days. You can cancel your listing at any time before it sells.</p>
                        </div>
                        
                        <div>
                          <h3 className="font-bold">Payments</h3>
                          <p className="text-sm">All payments are made in GOLD tokens. You will receive the payment minus fees when your NFT sells.</p>
                        </div>
                      </div>
                      
                      <div className="alert alert-info mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Need help? Check out our <Link href="/faq" className="link">FAQ</Link> or <Link href="/support" className="link">contact support</Link>.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-base-100 rounded-box">
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="mb-6">Connect your wallet to create a listing.</p>
                <button className="btn btn-goldium">Connect Wallet</button>
              </div>
            )}
          </div>
          
          <Footer />
        </PageContainer>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <Menu
            twitterHandle={twitterHandle}
            className="p-4 w-80 bg-base-100 text-base-content"
          />
        </div>
      </DrawerContainer>
    </>
  );
};

export default CreateListingPage;
