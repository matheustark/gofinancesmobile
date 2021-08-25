import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';

import { 
    Container,
    Header,
    UserInfo,
    UserWrapper,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon
 } from './styles';

export function Dashboard() {
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
            <HighlightCard />
        </Container>
    )
}

