import React, { useState } from 'react';
import { Modal } from 'react-native';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

export function Register() {
    const [ transactionType, setTransactionType ] = useState('');

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionType(type);
    }

    return (
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>
           <Form>
           <Fields>
            <Input
                placeholder="Nome"
                />
                <Input
                placeholder="Preço"
                />
                <TransactionsTypes>

                <TransactionTypeButton
                    title="income"
                    type="up"
                    onPress={() => handleTransactionTypeSelect('up')}
                    isActive={transactionType === 'up'}
                />
                <TransactionTypeButton
                    title="outcome"
                    type="down"
                    onPress={() => handleTransactionTypeSelect('down')}
                    isActive={transactionType === 'down'}
                />
                </TransactionsTypes>
                <CategorySelectButton title="Categoria" />
                </Fields>
                <Button title="Enviar" />
            </Form> 
            <Modal visible={false} >
                <CategorySelect />
            </Modal>
        </Container>
    )
}