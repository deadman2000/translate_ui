import React from "react";

export default function ProjectCell(props) {
    return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
        {props.children}
    </div>
}
