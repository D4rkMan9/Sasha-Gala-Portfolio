import { useState } from "react";




export function NavButton({fill, wd, ht, className, Show, setShow}){
    let A= "M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"
    let B= "m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"
    return( 
        <>
            <button onClick={() => setShow(!Show)} className={className}>
                <svg xmlns="http://www.w3.org/2000/svg" height={ht} viewBox="0 -960 960 960" width={wd} fill={fill}><path d={Show ? B : A} /></svg>
            </button>
        </>
    )
}