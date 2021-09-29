import React, {useState, useEffect, useCallback} from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container,
    Header,
    UserInfo,
    UserWrapper,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
 } from './styles';
import { useFocusEffect } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';

 export interface DataListProps extends TransactionCardProps {
     id: string;
 }

 interface HightLightProps {
     amount: string;
     lastTransaction: string;
 }

 interface HightLightData {
     entries: HightLightProps;
     expensives: HightLightProps;
     total: HightLightProps;
 }

export function Dashboard() {
    const [transaction, setTransaction] = useState<DataListProps[]>([]);
    const [hightlightTotal, setHightlightTotal] = useState({} as HightLightData);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();

    const { signOut } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
        ) {

        const lastTransaction = new Date( Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
             
    }

    async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey); 
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensivesTotal = 0;
    
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => { 

        if(item.type === 'positive') {
            entriesTotal += Number(item.amount);
        } else {
            expensivesTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
        .toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).format(new Date(item.date));

        return { 
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date

        }
    });
    setTransaction(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensives}`

    const total = entriesTotal  - expensivesTotal;

    setHightlightTotal({
        entries: { 
           amount: entriesTotal .toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        }),
        lastTransaction: `Última Entrada dia ${lastTransactionEntries}`
        },
        expensives: {
            amount: expensivesTotal .toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`

        },
        total: {
            amount: total.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            }),
            lastTransaction: totalInterval
        }
    })

    setIsLoading(false);
}

    useEffect(() => {
        loadTransactions();
        // const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey); 

    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []))

    return (
        <Container>

       { isLoading ? 
        <LoadContainer>
            <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
            />
        </LoadContainer>
         : <>
            <Header>
              <UserWrapper>
                <UserInfo>
                    <Photo 
                    source={{ uri: 'https://avatars.githubusercontent.com/u/21089092?v=4' }}
                    />
                        <User>
                         <UserGreeting>Olá,</UserGreeting>
                         <UserName>Matheus</UserName>
                      </User>
                </UserInfo>
                <LogoutButton onPress={signOut}>
                <Icon name="power" />
                </LogoutButton>
              </UserWrapper> 
            </Header>
         <HighlightCards>
            <HighlightCard
            type="up"
            title="Entrada"
            amount={hightlightTotal.entries.amount}
            lastTransaction={hightlightTotal.entries.lastTransaction}
            />
            <HighlightCard
            type="down"
            title="Saída"
            amount={hightlightTotal.expensives.amount}
            lastTransaction={hightlightTotal.expensives.lastTransaction}

            />
            <HighlightCard
            type="total"
            title="Total"
            amount={hightlightTotal.total.amount}
            lastTransaction={hightlightTotal.total.lastTransaction}

            />
          
        </HighlightCards>
        
        <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
                data={transaction}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            />
        </Transactions>
        
 </>
}
</Container>

    )
}

