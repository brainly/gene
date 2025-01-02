import {useInjection} from '@brainly-gene/core';
import {
  TRANSLATION_SERVICE_IDENTIFIER,
  TranslationServiceType,
} from '@brainly-gene/next';
import {useQuestion} from '@acme/social-qa/question/services/question-service';
import * as React from 'react';
import {useMediator} from '@brainly-gene/core'
import {
  ROUTER_SERVICE_IDENTIFIER,
  RouterIocType,
} from '@brainly-gene/core';

interface PropsType {
  ref: React.MutableRefObject<HTMLDivElement | null>;
}

export function useSomeLogic({ref}: PropsType) {
  const {query} = useInjection<RouterIocType>(ROUTER_SERVICE_IDENTIFIER)();
  const questionId = React.useMemo(() => Number(query.id), [query.id]);

  const {translate} = useInjection<() => TranslationServiceType>(
    TRANSLATION_SERVICE_IDENTIFIER
  )();

  const {data} = useQuestion({questionId});

  const author = React.useMemo(
    () => ({
      nick: data?.author?.nick || '',
      avatar: data?.author?.avatar?.thumbnailUrl || '',
      url: `app/profile/${data?.author?.databaseId}`,
    }),
    [data]
  );

  const copy = React.useMemo(
    () => ({
      deletedUserNick: translate('user_deleted_account_nick'),
      questionAttributes: translate('Question attributes'),
    }),
    [translate]
  );

  const breadcrumbs = React.useMemo(() => {
    const timeAgo = {
      value: data?.created || '',
      url: undefined,
      dataTest: 'question-box-header-time-ago',
    };

    const grade = {
      value: data?.grade?.name || '',
      url: `subject/${data?.subject?.slug}/${data?.grade?.slug}`,
      dataTest: 'question_box_grade',
    };

    const subject = {
      value: data?.subject?.name || '',
      url: `subject/${data?.subject?.slug}`,
      dataTest: 'question_box_grade',
    };

    return [timeAgo, subject, grade];
  }, [data]);

  const verified = !!data?.answers?.hasVerified;

  const useSomeMediators = () => {
    useMediator(
      'onMyButtonClicked',
      () => console.log('button clicked!'),
      ref
    )
  }

  return {
    someProps: {
      copy,
      verified,
      breadcrumbs,
      author,
    },
    useSomeMediators,
  };
}
