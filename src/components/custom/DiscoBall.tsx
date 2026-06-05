import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface DiscoBallProps {
    size?: number;
}

export default function DiscoBall({ size = 50 }: DiscoBallProps) {
    const animationRef = useRef<LottieView>(null);

    function handlePress() {
        animationRef.current?.reset();
        animationRef.current?.play();
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <View style={{ width: size, height: size, overflow: 'hidden' }}>
                <LottieView
                    ref={animationRef}
                    source={require('@/assets/animations/disco-ball.json')}
                    autoPlay={false}
                    loop={false}
                    style={{ width: size, height: size }}
                />
            </View>
        </TouchableOpacity>
    );
}