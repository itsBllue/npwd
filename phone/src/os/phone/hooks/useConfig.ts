import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';

export const useConfig = (): void => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  useEffect(() => {
    if (!isEnvBrowser()) {
      const resourceName = (window as any)?.GetParentResourceName() || 'npwd';
      fetch(`https://cfx-nui-${resourceName}/config.json`).then(async (res) => {
        const config = await res.json();
        setResourceConfig(config);
      });
    }
  }, []);
};
