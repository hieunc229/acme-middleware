
export function getDomainName(domain: string) {
  let parts = domain.split(".");

  if (parts.length > 3) {
    parts.splice(parts.length - 4, 1);
    domain = parts.join(".");
  }

  // Domain without subdomain
  if (parts.length === 2) {
    return domain;
  }

  // Domain with 2nd-level, without subdomain
  if (parts[1]?.length <= 2 || secondLevelExtensions.indexOf(parts[1]) !== -1) {
    return domain
  }

  // Domain with subdomain -> only take domain part
  return `${parts[1]}.${parts[2]}`
}

const secondLevelExtensions = ['gov', 'ac', 'edu', 'com', 'net', 'biz'];