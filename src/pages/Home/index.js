import { default as Hero } from '../../components/hero'
import { default as Features } from '../../components/features'

function Home() {
    return (
        <>
            <Hero />
            <Features />
            <div>PRICING</div>
            <div>CTA</div>
            <div>USE CASES AND BENEFITS</div>
        </>
    )
}

export default Home;