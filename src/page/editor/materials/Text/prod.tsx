import { useState } from "react";

const Text=()=> {

    
    const [text, setText] = useState<string>('我是默认文本');

    return (
        <div>
            {text}
        </div>
    );
}
export default Text