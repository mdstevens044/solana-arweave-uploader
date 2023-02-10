import { bundlrStorage, keypairIdentity, Metaplex, toMetaplexFile } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import * as fs from "fs";
import base58 from "bs58";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if(!privateKey) throw new Error('PRIVATE_KEY not found');
  const keypair = Keypair.fromSecretKey(base58.decode(privateKey));

  const ENDPOINT = clusterApiUrl('mainnet-beta');

  const BUNDLR_ADDRESS = "https://node1.bundlr.network:443/tx/solana";

  const connection = new Connection(ENDPOINT);

  const nfts = Metaplex
    .make(connection, { cluster: 'mainnet-beta' })
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
      address: BUNDLR_ADDRESS,
      providerUrl: ENDPOINT,
      timeout: 60000
    }))
    .nfts();

  const imageBuffer = fs.readFileSync("/path/to/image.png");
  const file = toMetaplexFile(imageBuffer, "image.png");

  const uploadedMetadata = await nfts.uploadMetadata({
    name: "",
    symbol: "",
    description: "",
    seller_fee_basis_points: 1000,
    external_url: "",
    properties: {
      files: [
        {
          type: "",
          uri: ""
        }
      ]
    },
  });

  console.log(`Uploaded metadata: ${uploadedMetadata.uri}`)
}

main()
  .then(() => {
    console.log("Done!")
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })