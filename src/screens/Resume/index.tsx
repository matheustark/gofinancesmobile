import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HistoryCard } from '../../components/HistoryCard';

import { 
    Container,
    Header,
    Title,
    Content
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: string;
    color: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const dataKey = '@gofinances:transactions';

    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      const response = data ? JSON.parse(data) : [];

      const expensives = response
      .filter((expensive: TransactionProps) => expensive.type === 'negative');

      const totalByCategory: CategoryData[] = [];

      categories.forEach(category => {
          let categorySum = 0;

          expensives.forEach((expensive: TransactionProps) => {
              if(expensive.category === category.key) {
                  categorySum += Number(expensive.amount)
              }
          });

          if (categorySum > 0) {
            const total = categorySum
            .toLocaleString('pt-BR', { 
                style: 'currency',
                currency: 'BRL'
            })

            totalByCategory.push({
                key: category.key,
                name: category.name,
                color: category.color,
                total,
            })
          }
          
      });

      setTotalByCategories(totalByCategory);

    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <Container>
            <Header>
                <Title>
                    Resumo por categoria
                </Title>
            </Header>
        <Content>
           {
           totalByCategories.map(item => (
               <HistoryCard
               key={item.key}
               title={item.name}
               amount={item.total}
               color={item.color}
                />
           )) 
           }
        </Content>
        </Container>
    )
}