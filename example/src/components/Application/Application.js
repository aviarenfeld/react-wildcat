import React from "react";
import radium from "radium";
import {Link as RawLink} from "react-router";
import {metrics} from "react-metrics";
import metricsConfig from "metrics.config.js";

import {links} from "application.config.js";
import styles from "./styles/applicationStyles.js";

// Wrap <Link> due to Radium fringe issue
// See: https://github.com/FormidableLabs/radium/tree/master/docs/faq#why-doesnt-radium-work-on-somecomponent
const Link = radium(RawLink);

class Application extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    render() {
        return (
            <div style={styles.application}>
                <div style={styles.container}>
                    <header>
                        <nav role="navigation">
                            <ul>
                                {links.map((link) => (
                                    <li key={link.text}>
                                        <Link
                                            style={styles.a}
                                            {...link}
                                        >
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <a key={404} href="not-found-route" style={styles.a}>404 Handling</a>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <main role="main">
                        {this.props.children}
                    </main>
                </div>
            </div>
        );
    }
}

export {Application as ApplicationComponent};
export default metrics(metricsConfig)(
    radium(Application)
);
