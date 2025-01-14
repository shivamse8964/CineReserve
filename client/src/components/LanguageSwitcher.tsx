import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="container mx-auto flex justify-center gap-2">
        <Button
          variant={i18n.language === 'en' ? 'default' : 'outline'}
          onClick={() => i18n.changeLanguage('en')}
        >
          {t('languages.en')}
        </Button>
        <Button
          variant={i18n.language === 'hi' ? 'default' : 'outline'}
          onClick={() => i18n.changeLanguage('hi')}
        >
          {t('languages.hi')}
        </Button>
        <Button
          variant={i18n.language === 'ur' ? 'default' : 'outline'}
          onClick={() => i18n.changeLanguage('ur')}
        >
          {t('languages.ur')}
        </Button>
      </div>
    </div>
  );
}
