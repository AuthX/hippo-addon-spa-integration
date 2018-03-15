import React from 'react';
import PlaceholderComponent from './placeholder';
import UndefinedComponent from "./undefined";
import { componentDefinitions } from "../../component-definitions";
import jsonpointer from 'jsonpointer';

export default class ContentComponentWrapper extends React.Component {
  renderContentComponentWrapper(component, content, preview) {
    // based on the type of the component, render a different React component
    if (component.label in componentDefinitions && componentDefinitions[component.label].component) {
      // component is defined, so render the component
      const componentEl = React.createElement(componentDefinitions[component.label].component,
        { content: content, preview: preview }, null);
      return (componentEl);
    } else {
      // component not defined in component-definitions
      return (
        <UndefinedComponent name={component.label}/>
      );
    }
  }

  render() {
    const configuration = this.props.configuration;
    const pageModel = this.props.pageModel;
    const preview = this.props.preview;
    let documentUuid;
    let content;

    // get content from model
    if (configuration && configuration.models && configuration.models.document && configuration.models.document['$ref']) {
      documentUuid = configuration.models.document['$ref'];
    } else if (this.props.documentUuid) {
      // NewsList component passed document ID through property instead of via reference in attributes map
      documentUuid = this.props.documentUuid;
    }

    if (documentUuid && (typeof documentUuid === 'string' || documentUuid instanceof String)) {
      content = jsonpointer.get(pageModel, documentUuid);
    } else if (documentUuid) {
      // TODO: news list sets UUID instead of serialized content-item once list serialization is fixed
      content = documentUuid;
    }

    if (!content && preview) {
      // return placeholder if no document is set on component
      return (
        <PlaceholderComponent name={configuration.label} />
      );
    } else if (!content) {
      // don't render placeholder outside of preview mode
      return null;
    }

    return (
      <React.Fragment>
        { this.renderContentComponentWrapper(configuration, content, preview) }
      </React.Fragment>
    );
  }
}