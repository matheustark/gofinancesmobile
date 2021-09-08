import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransacionCardProps, TransactionCardProps } from '../../components/TransactionCard';

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
    TransactionList
 } from './styles';

 export interface DataListProps extends TransactionCardProps {
     id: string;
 }

export function Dashboard() {
    const data: DataListProps[] = [
    {
        id: '1',
        type: 'positive',
        title:"Desenvolvimento de Site",
        amount:"R$ 12.000,00",
        category:{name: 'vendas', icon: 'dollar-sign'},
        date:"26/08/2021"
    },
    {
        id: '2',
        type: 'negative',
        title:"Hamburgueria",
        amount:"R$ 59,00",
        category:{name: 'Alimentação', icon: 'coffee'},
        date:"26/08/2021"
    },
    {
        id: '3',
        type: 'negative',
        title:"Aluguel apartamento",
        amount:"R$ 1000,00",
        category:{name: 'Casa', icon: 'home'},
        date:"26/08/2021"
    },
]

    return (
        <Container>
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
                <Icon name="power" />
              </UserWrapper> 
            </Header>
         <HighlightCards>
            <HighlightCard
            type="up"
            title="Entrada"
            amount="R$ 17.400,00"
            lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard
            type="down"
            title="Saída"
            amount="R$ 17.400,00"
            lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard
            type="total"
            title="Total"
            amount="R$ 17.400,00"
            lastTransaction="Última entrada dia 13 de abril"
            />
          
        </HighlightCards>
        
        <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            />
        </Transactions>
        
        </Container>
    )
}

