import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import LottieView from 'lottie-react-native'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FirebaseContext'

import Text from '../components/Text'

const LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        setTimeout(async () => {
            const user = firebase.getCurrentUser();

            if (user) {
                const userInfo = await firebase.getUserInfo(user.uid);

                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    profilePhotoURL: userInfo.profilePhotoURL,
                    method: userInfo.method,
                })
            }
            else {
                setUser((state) => ({ ...state, isLoggedIn: false }))
            }
        }, 2000)
    }, [])

    return (
        <Container>
            <Text title>Loading</Text>

            <LottieView
                source={require("../../assets/loading-paperplane.json")}
                autoPlay
                loop
                style={{ width: '100%' }} />
        </Container>
    )
}

export default LoadingScreen


const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`