'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Commune } from '@/app/models/communes';
import { ContactMairie } from '@/app/models/contact-mairie';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';
import useActiveTab from '@/app/utils/hooks/useActiveTab';
import useURLParams, { Codes } from '@/app/utils/hooks/useURLParams';
import { ALLOWED_TABS, codesDiffer } from '@/app/utils/state-utils';
import { X } from 'lucide-react';

import {
	COMMENT_AGIR_ELU_COMMON_BODY,
	COMMENT_AGIR_ELU_COMMON_TITLE,
	COMMENT_AGIR_PARTICULIER_COMMON,
	COMMENT_AGIR_PARTICULIER_COMMON_TITLE,
	COMMENT_AGIR_PARTICULIER_FICHE,
} from '../../content/accordion-actions';
import ContacterMairie from '../ContacterMairie';
import Loading from '../Loading';
import {
	LEVEL_TO_LABEL,
	LEVEL_TO_LABEL_SHORTENED,
	TYPE_ETABLISSEMENT_TO_LABEL,
	TYPE_ETABLISSEMENT_TO_LABEL_SHORTENED,
} from '../Map/layers/layers';
import ScrollButton from '../ScrollButton';
import FicheCommune from './ficheCommune';
import FicheDepartement from './ficheDepartement';
import FicheEtablissement from './ficheEtablissement/ficheEtablissement';
import FicheRegion from './ficheRegion';
import AccordionCard from './shared/AccordionCard';

const LABELS = {
	ARIA_FICHE: 'Fiche',
	ARIA_CLOSE_FICHE: 'Fermer la fiche',
	ARIA_LOADING: 'Chargement de la fiche en cours',
};

const getActions = (isLevelWithContactMairie: boolean, contactMairie: ContactMairie | null) => [
	{
		title: COMMENT_AGIR_ELU_COMMON_TITLE,
		content: <>{COMMENT_AGIR_ELU_COMMON_BODY}</>,
	},
	{
		title: COMMENT_AGIR_PARTICULIER_COMMON_TITLE,
		content: (
			<>
				{COMMENT_AGIR_PARTICULIER_COMMON.BODY_INTRO}
				<ul className='mb-8 mt-2 list-inside list-disc space-y-8'>
					<li>{COMMENT_AGIR_PARTICULIER_COMMON.BODY_SIGNER_PETITION_ITEM}</li>
					<li>
						{isLevelWithContactMairie ? (
							<ContacterMairie contact={contactMairie} />
						) : (
							COMMENT_AGIR_PARTICULIER_FICHE.BODY_CONTACT_ELU_ITEM
								.LEVEL_WITH_NO_CONTACT
						)}
					</li>
					<li>{COMMENT_AGIR_PARTICULIER_COMMON.BODY_DECOUVRER_LES_PROJETS_ITEM}</li>
					<li>{COMMENT_AGIR_PARTICULIER_FICHE.BODY_EN_SAVOIR_PLUS_ITEM}</li>
				</ul>
			</>
		),
	},
];

export type TabId = (typeof ALLOWED_TABS)[number];
type Tab = { id: TabId; label?: string; fullLabel?: string }[];

const LEVEL_WITH_CONTACT_MAIRIE: TabId[] = ['commune', 'etablissement'];

interface FichesProps {
	etablissement?: Etablissement;
	commune?: Commune;
	departement?: Departement;
	region?: Region;
	contactMairie?: ContactMairie;
	isFetching?: boolean;
}

function getInitialTab(codes: Codes): TabId {
	if (codes.codeEtablissement !== null) return 'etablissement';
	if (codes.codeCommune !== null) return 'commune';
	if (codes.codeDepartement !== null) return 'departement';
	if (codes.codeRegion !== null) return 'region';

	throw new Error(`Codes ${codes} is not supported to get initial tab`);
}

export default function Fiches({
	etablissement,
	commune,
	departement,
	region,
	contactMairie,
	isFetching,
}: FichesProps) {
	const { values } = useURLParams();
	const [, activeTab, setActiveTab] = useActiveTab();
	const prevValues = useRef(values);
	const ficheContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		/**
		 * `setActivetab` can be updated even if `values` are the same,
		 * so we avoid calling setActiveTab with getInitialTab which could reset to the lowest tab even if we manually changed tab in the same hierarchy
		 */
		if (codesDiffer(prevValues.current, values)) {
			setActiveTab(getInitialTab(values));
		}
		prevValues.current = values;
	}, [values, setActiveTab]);

	useEffect(() => {
		if (ficheContainerRef.current) {
			ficheContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
		}
	}, [activeTab]);

	const handleClose = useCallback(() => {
		setActiveTab(null);
	}, [setActiveTab]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [setActiveTab, handleClose]);

	const tabs: Tab = [
		...(region
			? [
					{
						id: 'region' as const,
						label: LEVEL_TO_LABEL_SHORTENED['region'],
						fullLabel: LEVEL_TO_LABEL['region'],
					},
				]
			: []),
		...(departement
			? [
					{
						id: 'departement' as const,
						label: LEVEL_TO_LABEL_SHORTENED['departement'],
						fullLabel: LEVEL_TO_LABEL['departement'],
					},
				]
			: []),
		...(commune
			? [
					{
						id: 'commune' as const,
						label: LEVEL_TO_LABEL_SHORTENED['commune'],
						fullLabel: LEVEL_TO_LABEL['commune'],
					},
				]
			: []),
		...(etablissement
			? [
					{
						id: 'etablissement' as const,
						label: TYPE_ETABLISSEMENT_TO_LABEL_SHORTENED[
							etablissement.type_etablissement
						],
						fullLabel: TYPE_ETABLISSEMENT_TO_LABEL[etablissement.type_etablissement],
					},
				]
			: []),
	];

	const [printOpen, setPrintOpen] = useState(false);

	const handleBeforePrint = async () => {
		setPrintOpen(true);
		await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
	};

	const handleAfterPrint = async () => {
		setPrintOpen(false);
	};

	const isLevelWithContactMairie = !!activeTab && LEVEL_WITH_CONTACT_MAIRIE.includes(activeTab);
	const accordionActions = getActions(isLevelWithContactMairie, contactMairie ?? null);

	return (
		<div
			className={`fixed right-0 top-0 z-fiche h-full w-full animate-slide-in-bottom overflow-y-auto bg-white pl-5 pr-3 pt-1 shadow-lg md:w-2/5 md:max-w-[450px] md:animate-slide-in-right md:rounded-md xl:absolute`}
			role='region'
			aria-label={`${LABELS.ARIA_FICHE} ${activeTab}`}
		>
			<div id='fiche-root' ref={ficheContainerRef}>
				<header>
					<button
						onClick={handleClose}
						className='absolute left-1 top-2 text-xl text-grey hover:text-black print:hidden'
						aria-label={LABELS.ARIA_CLOSE_FICHE}
					>
						<X aria-hidden='true' />
					</button>
					<div className='flex gap-1 pl-2 print:hidden'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								className={`truncate rounded-md px-4 py-2 text-xs font-bold md:text-sm ${activeTab === tab.id ? 'bg-blue font-bold text-green' : 'bg-green text-blue'}`}
								style={{ flexBasis: `${(1 / tabs.length) * 100}%` }}
								onClick={() => setActiveTab(tab.id)}
								title={tab.fullLabel}
							>
								{tab.label}
							</button>
						))}
					</div>
				</header>
				<section className='p-4'>
					{isFetching ? (
						<div role='alert' aria-label={LABELS.ARIA_LOADING} aria-live='polite'>
							<Loading />
						</div>
					) : (
						<>
							{activeTab === 'region' && region && (
								<FicheRegion
									region={region}
									ficheRef={ficheContainerRef}
									onBeforePrint={handleBeforePrint}
									onAfterPrint={handleAfterPrint}
								/>
							)}
							{activeTab === 'departement' && departement && (
								<FicheDepartement
									departement={departement}
									ficheRef={ficheContainerRef}
									onBeforePrint={handleBeforePrint}
									onAfterPrint={handleAfterPrint}
								/>
							)}
							{activeTab === 'commune' && commune && (
								<FicheCommune
									commune={commune}
									ficheRef={ficheContainerRef}
									onBeforePrint={handleBeforePrint}
									onAfterPrint={handleAfterPrint}
								/>
							)}
							{activeTab === 'etablissement' && etablissement && (
								<FicheEtablissement
									etablissement={etablissement}
									ficheRef={ficheContainerRef}
									onBeforePrint={handleBeforePrint}
									onAfterPrint={handleAfterPrint}
								/>
							)}
							<ScrollButton targetId='accordion-fiches' label='Comment agir ?' />
							<hr className='my-4' />
							<AccordionCard
								actions={accordionActions}
								printOpen={printOpen}
								contentCss='text-white text-sm'
								id='accordion-fiches'
							/>
						</>
					)}
				</section>
			</div>
		</div>
	);
}
