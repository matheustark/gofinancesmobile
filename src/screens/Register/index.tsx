import React, { useState, useEffect } from 'react';
import { 
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Alert
 } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid'

import { useForm } from 'react-hook-form';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Form/InputForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';

interface FormData {
    name: string;
    amount: string;
}

type NavigationProps = {
    navigate: (screen: string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatorio'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

export function Register() {
    const [ transactionType, setTransactionType ] = useState('');
    const [categoryModal, setCategoryModal] = useState(false);

    const dataKey = '@gofinances:transactions';

    const { 
        control, 
        handleSubmit,
        reset,
        formState: { errors }
     } = useForm({
        resolver: yupResolver(schema)
    });

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const navigation = useNavigation<NavigationProps>();

    function handleCloseCategoryModal() {
        setCategoryModal(false)
    }

    function handleOpenCategoryModal() {
        setCategoryModal(true)
    }

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    async function handleRegister(form: FormData) {
        if (!transactionType) {
            return Alert.alert('Selecione o tipo da transação!')
        }

        if (category.key === 'category') {
            return Alert.alert('Selecione uma categoria!')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
         const data = await AsyncStorage.getItem(dataKey);
         const currentData = data ? JSON.parse(data) : [];
         const dataFormatted = [
             ...currentData,
             newTransaction
         ]

         await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted)); 

         reset();
         setTransactionType('');
         setCategory({
            key: 'category',
            name: 'Categoria',
        });

        navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possivel salvar');
        }
    }

    useEffect(() => {
        async function loadData() {
         const data = await AsyncStorage.getItem(dataKey); 
         console.log(data);
        }

        loadData();

    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>
           <Form>
           <Fields>
            <InputForm
                control={control}
                name="name"
                placeholder="Nome"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.name && errors.name.message}
                />
                <InputForm
                control={control}
                name="amount"
                placeholder="Preço"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}

                />      
                <TransactionsTypes>

                <TransactionTypeButton
                    title="income"
                    type="up"
                    onPress={() => handleTransactionTypeSelect('positive')}
                    isActive={transactionType === 'positive'}
                />
                <TransactionTypeButton
                    title="outcome"
                    type="down"
                    onPress={() => handleTransactionTypeSelect('negative')}
                    isActive={transactionType === 'negative'}
                />
                </TransactionsTypes>
                <CategorySelectButton
                 title={category.name}
                 onPress={handleOpenCategoryModal}
                 />
                </Fields>
                <Button 
                title="Enviar"
                onPress={handleSubmit(handleRegister)}
                />
            </Form> 
            <Modal visible={categoryModal} >
                <CategorySelect
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseCategoryModal}
                />
            </Modal>
        </Container>
        </TouchableWithoutFeedback>
    )
}