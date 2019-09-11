import {
  getAttrsFromUrl,
  addFileAttrsToUrl,
  objectToQueryString,
} from '../../url';

describe('url utils', () => {
  describe('getAttrsFromUrl()', () => {
    it('should return media attrs from url', () => {
      const url =
        'blob:http://localhost/blob_id#media-blob-url=true&id=file_id&collection=some_collection&contextId=some_context_id';

      expect(getAttrsFromUrl(url)).toEqual({
        id: 'file_id',
        collection: 'some_collection',
        contextId: 'some_context_id',
      });
    });

    it('should ignore non media attrs from url', () => {
      const url =
        'blob:http://localhost/blob_id#media-blob-url=true&non_media_attr=hi&id=file_id&collection=some_collection&contextId=some_context_id&width=10&height=100some_attr=value';

      expect(getAttrsFromUrl(url)).toEqual({
        id: 'file_id',
        collection: 'some_collection',
        contextId: 'some_context_id',
        width: 10,
        height: 100,
      });
    });

    it('should return undefined if any of required attrs is missing', () => {
      const url =
        'blob:http://localhost/blob_id#media-blob-url=true&id=file_id&collection=some_collection';

      expect(getAttrsFromUrl(url)).toBeUndefined();
    });
  });

  describe('addFileAttrsToUrl()', () => {
    it('should add media blob key to url', () => {
      const url = 'blob:http://localhost/blob_id';

      expect(
        addFileAttrsToUrl(url, {
          contextId: '',
          id: '',
        }),
      ).toEqual(
        'blob:http://localhost/blob_id#media-blob-url=true&contextId=&id=',
      );
    });

    it('should add media attrs to url', () => {
      const url = 'blob:http://localhost/blob_id';

      expect(
        addFileAttrsToUrl(url, {
          contextId: 'context-id',
          id: 'file-id',
          collection: 'collection-name',
          height: 5,
          width: 50,
          mimeType: 'image/png',
          name: 'file-name.png',
          size: 100,
        }),
      ).toEqual(
        'blob:http://localhost/blob_id#media-blob-url=true&contextId=context-id&id=file-id&collection=collection-name&height=5&width=50&mimeType=image%2Fpng&name=file-name.png&size=100',
      );
    });
  });

  describe('objectToQueryString()', () => {
    it('should convert simple object', () => {
      const result = objectToQueryString({
        key1: 1,
        key2: 'string',
        key3: false,
      });
      expect(result).toBe('key1=1&key2=string&key3=false');
    });

    it('should convert complex object', () => {
      const result = objectToQueryString({ '%$^=': 1, key2: '&=%$' });
      expect(result).toBe('%25%24%5E%3D=1&key2=%26%3D%25%24');
    });
  });
});
