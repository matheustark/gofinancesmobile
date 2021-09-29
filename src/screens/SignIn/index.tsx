import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoggleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

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
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();

    const theme = useTheme();

   async function handleSignIinWithGoogle() {
        try {
            setIsLoading(true);
           return await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('erro ao fazer login com a conta Google')
        } finally {
            setIsLoading(false);

        }
    }

    async function handleSignIinWithApple() {
        try {
            setIsLoading(true);
          return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('erro ao fazer login com a conta Apple')
        } finally {
            setIsLoading(false);

        }
    }

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
                        onPress={handleSignIinWithGoogle}
                    />

                    <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSvg}
                        onPress={handleSignIinWithApple}
                    />
                </FooterWrapper>
                { isLoading && 
                <ActivityIndicator 
                color={theme.colors.shape}
                style={{marginTop: 18}}
                /> }
            </Footer>
        </Container>
    )
}