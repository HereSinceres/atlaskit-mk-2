import { fontFamily, fontSize } from '@atlaskit/theme';
import { defaultSchema } from '@atlaskit/adf-schema';
import { createNamespace } from 'cls-hooked';
import { Fragment, Node as PMNode, Schema } from 'prosemirror-model';
import flow from 'lodash.flow';
import property from 'lodash.property';

import {
  Serializer,
  serializeFragmentWithAttachmentsResult,
  MediaImageBase64,
} from '../serializer';
import { nodeSerializers } from './serializers';
import styles from './styles';
import juice from 'juice';
import { escapeHtmlString } from './util';

import * as icons from './static/icons';

const serializerSession = createNamespace('serializerSession');

const serializeNode = (
  node: PMNode,
  index: any,
  parent?: PMNode,
  serializedHTML?: string,
): string => {
  // ignore nodes with unknown type
  if (!nodeSerializers[node.type.name]) {
    return `[UNKNOWN_NODE_TYPE: ${node.type.name}]`;
  }

  const parentAttrs = getAttrsFromParent(index, parent);

  return nodeSerializers[node.type.name]({
    node,
    attrs: {
      ...node.attrs,
      ...parentAttrs,
    },
    marks: node.marks,
    parent: parent,
    text:
      serializedHTML || node.attrs.text || node.attrs.shortName || node.text,
  });
};

/**
 * Used to pass attributes that affect nested nodes.
 *
 * Example: A 'table' node contains 'isNumberColumnEnabled' flag. In order to render
 * numbered columns, 'tableRow' node needs to know this information, thus this function.
 *
 * @param parent {PMNode} parent node
 * @param index {number} index of current child in parent's content array
 */
const getAttrsFromParent = (
  index: number,
  parent?: PMNode,
): { [key: string]: any } => {
  if (parent && parent.attrs && parent.attrs.isNumberColumnEnabled) {
    return {
      index: index,
      isNumberColumnEnabled: true,
    };
  }
  return {};
};

const traverseTree = (fragment: Fragment, parent?: PMNode): any => {
  let output = '';
  fragment.forEach((childNode, _offset, idx) => {
    if (childNode.isLeaf) {
      output += serializeNode(childNode, idx, parent);
    } else {
      const innerHTML = traverseTree(childNode.content, childNode);
      output += serializeNode(childNode, idx, parent, innerHTML);
    }
  });

  return output;
};

export const commonStyle = {
  'font-family': fontFamily(),
  'font-size': `${fontSize()}px`,
  'font-weight': 400,
  'line-height': '24px',
};

const wrapAdf = (content: any[]) => ({ version: 1, type: 'doc', content });

const juicify = (html: string): string =>
  juice(`<style>${styles}</style><div class="wrapper">${html}</div>`);

// replace all CID image references with a fake image
const stubImages = (isMockEnabled: boolean) => (content: string) => {
  if (!isMockEnabled) {
    return content;
  }

  const imageReplacer = (
    match: string,
    imageType: string,
    imageName: string,
  ): string => {
    switch (imageType) {
      default:
      case 'icon':
        return (icons as any)[imageName];
    }
  };

  return content
    .replace(/src="cid:pfcs-generated-([\w]*)-([\w-]*)"/gi, imageReplacer)
    .replace(
      /src="cid:[\w-]*"/gi,
      'src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="',
    );
};

export const createContentId = (
  imageName: string,
  imageType: string = 'icon',
) => {
  return `cid:pfcs-generated-${imageType}-${imageName}`;
};

const includeEmbeddedImages = (
  result: string,
): serializeFragmentWithAttachmentsResult => {
  const iconSet: Set<string> = serializerSession.get('icons');
  const iconMapper = (iconName: string): MediaImageBase64 => ({
    contentId: createContentId(iconName),
    contentType: '',
    data: (icons as any)[iconName],
  });

  const embeddedImages: MediaImageBase64[] = [...iconSet].map(iconMapper);
  return { result, embeddedImages };
};

const createImageSetInContext = (content: Fragment): Fragment => {
  serializerSession.set('icons', new Set<String>());
  return content;
};

export default class EmailSerializer implements Serializer<string> {
  /**
   * Email serializer allows to disable/mock images.
   * The reason behind this is the default behavior is that in email, images are embedded separately
   * and refenreced via CID. When however rendered in browser, this does not work and breaks the experience
   * when rendered in demo page.
   */
  constructor(
    private schema: Schema = defaultSchema,
    private isImageStubEnabled = false,
  ) {}

  serializeFragment = flow(
    (fragment: Fragment) => fragment.toJSON(),
    JSON.stringify,
    escapeHtmlString,
    JSON.parse,
    wrapAdf,
    this.schema.nodeFromJSON,
    property('content'),
    traverseTree,
    juicify,
    stubImages(this.isImageStubEnabled),
  );

  serializeFragmentWithAttachments = (fragment: Fragment) => {
    const boundSerializer = serializerSession.bind(
      flow(
        createImageSetInContext,
        this.serializeFragment,
        includeEmbeddedImages,
      ),
    );

    return boundSerializer(fragment);
  };

  static fromSchema(schema: Schema = defaultSchema): EmailSerializer {
    return new EmailSerializer(schema);
  }
}
