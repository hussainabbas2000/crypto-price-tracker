import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Crypto } from "@/types/crypto";

const fetchCryptoPrices = async (): Promise<Crypto[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 sec delay for testing
  
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets/", {
      params: {
        vs_currency: "usd",
        ids: "bitcoin,ethereum,polkadot,cardano,solana",
      },
    });
    return data;
  } catch (err){
    console.log("Error fetching crypto prices:", err);
    throw new Error("Error fetching cryptocurrency data. Please try again later.");
  }
};

export const useCryptoPrices = () => {
  return useQuery<Crypto[]>({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: false, // Disable auto-refresh
  });
};
