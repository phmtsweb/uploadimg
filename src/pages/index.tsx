import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

interface CardData {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type FetchImagesResponse = {
  data: CardData[];
  after: number[] | [null];
};

export default function Home(): JSX.Element {
  async function fetchImages({
    pageParam = null,
  }): Promise<FetchImagesResponse> {
    const { data } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(response => response.data);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  } else if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            mt="40px"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
