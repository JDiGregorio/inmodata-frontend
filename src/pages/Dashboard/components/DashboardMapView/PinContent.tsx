import React from 'react'

interface PinContentProps {
    scale?: number;
    background: string;
    borderColor: string;
    glyphColor: string;
}

export function PinContent({ scale = 1, background, borderColor, glyphColor }: PinContentProps) {
    const hostRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        if (!hostRef.current) {
            return
        }

        if (!google?.maps?.marker?.PinElement) {
            return
        }

        const pin = new google.maps.marker.PinElement({
            background,
            borderColor,
            glyphColor,
            scale
        })

        hostRef.current.replaceChildren(pin.element)
    }, [background, borderColor, glyphColor, scale])

    return (
        <div ref={hostRef} />
    )
}