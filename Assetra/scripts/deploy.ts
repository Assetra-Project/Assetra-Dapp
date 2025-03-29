
import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";
async function main() {
    // Get the signer of the tx and address for minting the token
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // The deployer will also be the owner of our contract
    const Assetra = await ethers.getContractFactory("Assetra", deployer);
    const contract = await Assetra.deploy({ from: deployer.address });
  
    console.log("Contract deployed at:", contract.target);
  }
  
  main().catch(console.error);