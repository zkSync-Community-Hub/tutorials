import { deployContract } from "./utils";
export default async function () {
  const contractArtifactName = "Escrow";
  const constructorArguments = [];
  await deployContract(contractArtifactName, constructorArguments);
}