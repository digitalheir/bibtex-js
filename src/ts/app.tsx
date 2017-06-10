import * as React from "react";
import {render} from "react-dom";
import {} from "material-components-web";
import {TexTranslator} from "./components/TexTranslator";

const mountPoint = document.getElementById("mount-point");

if (mountPoint)
    render(
        <TexTranslator/>,
        mountPoint
    );
