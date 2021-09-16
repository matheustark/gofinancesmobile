import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

import { VictoryPie } from 'victory-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';

import { HistoryCard } from '../../components/HistoryCard';

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectIcon,
    MonthSelectButton,
    Mounth


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
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    const dataKey = '@gofinances:transactions';

    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      const response = data ? JSON.parse(data) : [];

      const expensives = response
      .filter((expensive: TransactionProps) => expensive.type === 'negative');

      const expensiveTotal = expensives
      .reduce((acumulator: number, expensive: TransactionProps) => {
          return acumulator + Number(expensive.amount);
      }, 0);

      const totalByCategory: CategoryData[] = [];

      categories.forEach(category => {
          let categorySum = 0;

          expensives.forEach((expensive: TransactionProps) => {
              if(expensive.category === category.key) {
                  categorySum += Number(expensive.amount)
              }
          });

          if (categorySum > 0) {
            const totalFormatted = categorySum
            .toLocaleString('pt-BR', { 
                style: 'currency',
                currency: 'BRL'
            });

            const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`

            totalByCategory.push({
                key: category.key,
                name: category.name,
                color: category.color,
                total: categorySum,
                totalFormatted,
                percent,
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

    <Content
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: useBottomTabBarHeight(),
    }}
    >

        <MonthSelect>
            <MonthSelectButton>
                <MonthSelectIcon name="chevron-left" />              
            </MonthSelectButton>

            <Mounth>Setembro</Mounth>
           
            <MonthSelectButton>
                <MonthSelectIcon name="chevron-right" />              
            </MonthSelectButton>

        </MonthSelect>

        <ChartContainer>
        <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
                labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                }
            }}
            labelRadius={50}
            x="percent"
            y="total"
        />
        </ChartContainer>
           {
           totalByCategories.map(item => (
               <HistoryCard
               key={item.key}
               title={item.name}
               amount={item.totalFormatted}
               color={item.color}
                />
           )) 
           }
        </Content>
        </Container>
    )
}