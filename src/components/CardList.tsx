import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onClose, onOpen } = useDisclosure();
  const firstRender = useRef(true);

  // TODO SELECTED IMAGE URL STATE
  const [currentURL, setCurrentURL] = useState<string>('');
  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(url: string) {
    setCurrentURL(url);
    onOpen();
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid gridTemplateColumns={'repeat(3, 1fr)'} gap={'40px'}>
        {cards.map(card => (
          <Card key={card.ts} data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>
      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={currentURL} />
    </>
  );
}
