import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoggleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton'

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

export function SignIn() {
    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                    width={RFValue(200)}
                    height={RFValue(200)}
                    />
                <Title>
                    Controle suas finanças 
                    de forma muito simples
                </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoggleSvg}
                    />

                    <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}