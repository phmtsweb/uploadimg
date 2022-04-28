import {
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="6px">
        <ModalCloseButton />
        <ModalBody p="0">
          <Img src={imgUrl} maxW={'900px'} w="100%" h="auto" maxH={'600px'} />
        </ModalBody>
        <ModalFooter bg="pGray.800" justifyContent="flex-start" h="32px">
          <Link
            href={imgUrl}
            isExternal
            _hover={{ textDecoration: 'none' }}
            fontSize={'14px'}
            lineHeight={'16px'}
            fontWeight="400"
            color="pGray.50"
          >
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
