import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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
    const { signInWithGoogle, signInWithApple } = useAuth();

   async function handleSignIinWithGoogle() {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('erro ao fazer login com a conta Google')
        }
    }

    async function handleSignIinWithApple() {
        try {
            await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('erro ao fazer login com a conta Apple')
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
            </Footer>
        </Container>
    )
}