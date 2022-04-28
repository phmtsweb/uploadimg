import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageRegisterProps {
  title: string;
  description: string;
  image: File;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: ([file]: File[]) =>
          file.size <= 10 * 1024 * 1024 || 'Arquivo deve ser menor que 10MB',
        acceptedFormats: ([file]: File[]) =>
          /^image\/(jpe?g|png|gif)$/.test(file.type) ||
          'Somente são aceitos arquivos PNG, JPEG, GIF',
      },
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();

  console.log(queryClient);
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (registerImage: ImageRegisterProps) => {
      await api.post('/api/images', {
        title: registerImage.title,
        description: registerImage.description,
        url: imageUrl,
      });
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => queryClient.invalidateQueries(['images']),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onError: SubmitErrorHandler<ImageRegisterProps> = async errors => {
    console.log(errors);
  };

  const onSubmit: SubmitHandler<ImageRegisterProps> = async (
    data,
    event
  ): Promise<void> => {
    console.log(data);
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Falha no envio',
          description: 'Ocorreu um erro ao realizar o upload da sua imagem.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      // TODO EXECUTE ASYNC MUTATION

      await mutation.mutateAsync(data);
      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // TODO SHOW SUCCESS TOAST
    } catch (err) {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      console.log(err);
      toast({
        title: 'Falha no envio',
        description: 'Ocorreu um erro ao realizar o upload da sua imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      setImageUrl('');
      setLocalImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={4}>
        <FileInput
          onChange={async () => {}}
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
        onClick={() => console.log(errors)}
      >
        Enviar
      </Button>
    </Box>
  );
}
