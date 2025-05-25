import React, { useState } from "react";
import { useWallet } from "@vechain/dapp-kit-react";
import { ABIContract, Address, Clause, VET } from "@vechain/sdk-core";
import { ThorClient } from "@vechain/sdk-network";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Input,
  Text,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import meditateLogo from "../assets/meditate.png";
import { ACTION_CONTRACT_ABI, config } from "@repo/config-contract";
import { THOR_URL } from "../config/constants";
import { VetBalance } from "./vetbalance";
import "./meditate.css";

enum TransactionStatus {
  NotSent = "NOT_SENT",
  Pending = "PENDING",
  Success = "SUCCESS",
  Reverted = "REVERTED",
}

export function Meditate({refetch}) {
  const { account, signer } = useWallet();
  
  const toast = useToast();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  // Split form data into separate states
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(
    TransactionStatus.NotSent
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!account) return null;

  // Handle form submissions
  const onMeditate = async () => {
    if (!message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      onModalClose();

      const contractClause = Clause.callFunction(
        Address.of(config.CONTRACT_ADDRESS),
        ABIContract.ofAbi(ACTION_CONTRACT_ABI).getFunction("saveAction"),
        ["Meditate" ,message],
        VET.of(0),
        { comment: "meditation" }
      );

      const tx = () =>
        signer?.sendTransaction({
            clauses: [
                {
                    to: contractClause.to,
                    value: contractClause.value.toString(),
                    data: contractClause.data.toString(),

                },
            ],
          comment: `Meditate action saved!`,
        });

      
      const result = await tx();
      setTxId(result);
      setTxStatus(TransactionStatus.Pending);
      onDrawerOpen();

      const thorClient = ThorClient.at(THOR_URL);
      const txReceipt = await thorClient.transactions.waitForTransaction(
        result
      );

      if (txReceipt?.reverted) {
        setTxStatus(TransactionStatus.Reverted);
        toast({
          title: "Transaction Failed",
          description: "The transaction was reverted.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setTxStatus(TransactionStatus.Success);
        toast({
          title: "Success!",
          description: "Your action saved !!!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        refetch(txReceipt)
      }
    } catch (error) {
      console.error("Error saving action:", error);
      setTxStatus(TransactionStatus.Reverted);
      toast({
        title: "Error",
        description: "An error occurred while saving your action.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeditate = () => {
    setTxId(null);
    setTxStatus(TransactionStatus.NotSent);
    setMessage("");
    onModalOpen();
  };

  return (
    <div style={{ position: "relative", top: "30px", height: '150px' }}>
      <Button
        onClick={handleMeditate}
        variant="unstyled"
        _hover={{ transform: "scale(1.05)" }}
        transition="transform 0.2s"
      >
        <img src={meditateLogo} className="meditate" alt="Meditation logo" style={{ width: '150px', height: 'auto' }} />
      </Button>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Meditation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text fontSize="md">Mark your meditation action</Text>
              <Text fontSize="sm">Leave a lovely memory:</Text>              
              <Input
                id="lovely-memory"
                placeholder="Lovely-memory"
                size="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isRequired
              />
              <VetBalance />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={onMeditate}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Action
            </Button>
            <Button colorScheme="blue" onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isDrawerOpen} placement="bottom" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Meditate Status</DrawerHeader>
          <DrawerBody>
            {txId && <Text>Transaction ID: {txId}</Text>}
            {txStatus === TransactionStatus.Pending && (
              <Text>Transaction is pending...</Text>
            )}
            {txStatus === TransactionStatus.Success && (
              <Text>Transaction succeeded! ✅</Text>
            )}
            {txStatus === TransactionStatus.Reverted && (
              <Text>Transaction reverted! ❌</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}