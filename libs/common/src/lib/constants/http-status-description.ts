export const CREATED_RESPONSE_DESCRIPTION =
  'Indicates that the request has been fulfilled and has resulted in one or more new resources being created.';

export const ACCEPTED_RESPONSE_DESCRIPTION =
  'Indicates that the request has been accepted for processing, but the processing has not been completed.';

export const OK_RESPONSE_DESCRIPTION =
  'Indicates that the request has succeeded. The payload sent in a response depends on the request method.';

export const BAD_REQUEST_RESPONSE_DESCRIPTION =
  'Indicates that the server cannot or will not process the request due to something that is perceived to be a client error.';

export const CONFLICT_RESPONSE_DESCRIPTION =
  'Indicates that the request could not be completed due to a conflict with the current state of the target resource.';

export const NOT_FOUND_RESPONSE_DESCRIPTION =
  'Indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.';

export const NO_CONTENT_RESPONSE_DESCRIPTION =
  'Indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.';

export const FORBIDDEN_RESPONSE_DESCRIPTION =
  'Indicates that the server understood the request but refuses to authorize it.';

export const UNAUTHORIZED_RESPONSE_DESCRIPTION =
  'Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.';

export const NOT_ACCEPTABLE_RESPONSE_DESCRIPTION =
  'Indicates that the target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request.';

export const PAYLOAD_TOO_LARGE_RESPONSE_DESCRIPTION =
  'Indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process.';

export const UNSUPPORTED_MEDIA_TYPE_RESPONSE_DESCRIPTION =
  'Indicates that the origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.';

export const NOT_IMPLEMENTED_RESPONSE_DESCRIPTION =
  'Indicates that the server does not support the functionality required to fulfill the request.';

export const REQUEST_TIMEOUT_RESPONSE_DESCRIPTION =
  'Indicates that the server did not receive a complete request message within the time that it was prepared to wait.';

export const SERVICE_UNAVAILABLE_RESPONSE_DESCRIPTION =
  'Indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.';

export const PROXY_AUTHENTICATION_RESPONSE_DESCRIPTION =
  'Indicates that the client needs to authenticate itself in order to use a proxy.  The proxy MUST send a Proxy-Authenticate header field containing a challenge applicable to that proxy for the target resource.';

export const BAD_GATEWAY_RESPONSE_DESCRIPTION =
  'Indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.';

export const GATEWAY_TIMEOUT_RESPONSE_DESCRIPTION =
  'Indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.';

export const INTERNAL_SERVER_ERROR_RESPONSE_DESCRIPTION =
  'Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.';
