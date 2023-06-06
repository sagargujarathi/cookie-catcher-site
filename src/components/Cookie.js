import React, { useEffect, useRef } from 'react'
import '../css/Cookie.css'
function Cookie({ xValue, speed, deleteCookie, setScore, basketRef }) {
    const cookieRef = useRef()
    useEffect(() => {
        const timer = setTimeout(() => {
            deleteCookie({ xValue, speed })
        }, speed * 1000);
        const check = setInterval(() => {
            const basketStyle = getComputedStyle(basketRef.current)
            const cookieStyle = getComputedStyle(cookieRef.current)
            const basketLeft = Number(basketStyle.left.replace('px', ''))
            const basketRight = Number(basketStyle.right.replace('px', ''))
            const cookieLeft = Number(cookieStyle.left.replace('px', ''))
            const cookieRight = Number(cookieStyle.right.replace('px', ''))
            const basketTop = Number(basketStyle.top.replace('px', ''))
            const cookieTop = Number(cookieStyle.top.replace('px', ''))
            if (cookieTop >= basketTop) {
                if (basketLeft <= cookieLeft && cookieRight >= basketRight) {
                    setScore(prev => prev + 1)
                    deleteCookie({ xValue, speed })
                }
            }

        }, 10)
        return () => {
            clearTimeout(timer)
            clearInterval(check)
        }
    }, [])
    return (
        <div
            className="cookie"
            style={{ left: `${xValue}%`, animationDuration: `${speed}s` }}
            key={`a${speed + xValue}`}
            ref={cookieRef}
        >

        </div>
    )
}

export default Cookie