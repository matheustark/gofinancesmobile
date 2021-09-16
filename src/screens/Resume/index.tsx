import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    Mounth,
    LoadContainer


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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    const dataKey = '@gofinances:transactions';

    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
          const newDate =  addMonths(selectedDate, 1);
          setSelectedDate(newDate);
        } else {
            const newDate =  subMonths(selectedDate, 1);
            setSelectedDate(newDate); 
        }
    }

    async function loadData() {
        setIsLoading(true);

      const data = await AsyncStorage.getItem(dataKey);
      const response = data ? JSON.parse(data) : [];

      const expensives = response
      .filter((expensive: TransactionProps) => 
      expensive.type === 'negative' && 
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()   
      );

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
      setIsLoading(false);

    }

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]))

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
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <MonthSelectIcon name="chevron-left" />              
            </MonthSelectButton>

            <Mounth>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Mounth>
           
            <MonthSelectButton onPress={() => handleDateChange('next')}>
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
        </>
}
        </Container>
    )
}