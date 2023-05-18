/* eslint-disable react-hooks/exhaustive-deps */
import { vscode } from "../utilities/vscode";
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { mergeJSON } from "../utilities/utils";
import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";

MainEditor.propTypes = {
    content: PropTypes.shape({
        test1: PropTypes.number,
        test2: PropTypes.number,
        test3: PropTypes.number,
    }),
}
MainEditor.defaultProps = {
    content: {
        test1: 0,
        test2: 0,
        test3: 0
    },
}

function MainEditor(props: any) {
    // message集合了defaultProps与props，pros为空时将使用defaultProps，内部字段存在冲突则props优先级更高。
    const message = { "action": "onChange", ...mergeJSON(MainEditor.defaultProps.content, props?.content) };
    const content = message;

    const [test1, setTest1] = useState<string>(content.test1.toString());
    const [test2, setTest2] = useState<string>(content.test2.toString());
    const [test3, setTest3] = useState<string>(content.test3.toString());

    const onChange = (event: any) => {
        const name = event?.target?.name;
        const value = event?.target?.value;

        switch (event?.target?.name) {
            case "test1":
                setTest1(value);
                message[name] = Number(value);
                break;
            case "test2":
                setTest2(value);
                message[name] = Number(value);
                break;
            case "test3":
                setTest3(value);
                message[name] = Number(value);
                break;
            default:
                break;
        }
        vscode.postMessage(message);
    }

    return (
        <main className="editor-main">
            <div>MainEditor</div>
            <br />
            <div>content:{JSON.stringify(content)}</div>
            <br />
            <div>
                <div>
                    test1:
                    <VSCodeDropdown name="test1" value={test1} onChange={onChange} position="below">
                        <VSCodeOption value="0">Turn-off</VSCodeOption>
                        <VSCodeOption value="1">Turn-on</VSCodeOption>
                        <VSCodeOption value="2">Auto</VSCodeOption>
                    </VSCodeDropdown>
                </div>
                <br />
                <div>
                    test2:
                    <VSCodeDropdown name="test2" value={test2} onChange={onChange} position="below" >
                        <VSCodeOption value="0">Torque control</VSCodeOption>
                        <VSCodeOption value="1">Speed control</VSCodeOption>
                        <VSCodeOption value="2">Position control</VSCodeOption>
                    </VSCodeDropdown>
                </div>
                <br />
                <div>
                    test3:
                    <VSCodeDropdown name="test3" position="below" value={test3} onChange={onChange}>
                        <VSCodeOption value="0">Disable PWM generation</VSCodeOption>
                        <VSCodeOption value="1">Switch on brake resistor</VSCodeOption>
                        <VSCodeOption value="2">Turn on low side switches</VSCodeOption>
                    </VSCodeDropdown>
                </div>

            </div>
        </main>
    );
}

export default MainEditor;