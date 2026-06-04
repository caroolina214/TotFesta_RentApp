import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';

interface DiscoBallProps {
    size?: number;
}

export default function DiscoBall({ size = 80 }: DiscoBallProps) {
    const animationRef = useRef<LottieView>(null);

    function handlePress() {
        animationRef.current?.reset();
        animationRef.current?.play();
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <LottieView
                ref={animationRef}
                source={require('@/assets/animations/disco-ball.json')}
                autoPlay={false}
                loop={false}
                style={{ width: size, height: size }}
            />
        </TouchableOpacity>
    );
}