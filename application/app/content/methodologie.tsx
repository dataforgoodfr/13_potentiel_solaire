/* eslint-disable react/jsx-key */
import type { StaticPageProps } from '../components/StaticPage';

const linkStyle =
	'text-green underline decoration-dotted decoration-2 underline-offset-4 transition hover:decoration-solid';

/**
 * Content for "Notre méthodologie" page
 * Reminder :
 * - heading properties are turned into h2 by StaticPage component
 * - paragraphs keys are handled in StaticPage component
 */
const notreMethodologieContent: StaticPageProps = {
	title: 'Notre méthodologie',
	sections: [
		{
			heading: 'Sommaire',
			paragraphs: [
				<ol className='list-inside list-decimal'>
					<li>
						<a href='#section-en-bref' className={linkStyle}>
							En bref
						</a>
					</li>
					<li>
						<a href='#section-data' className={linkStyle}>
							Data
						</a>
					</li>
					<li>
						<a href='#section-web' className={linkStyle}>
							Web
						</a>
					</li>
				</ol>,
			],
		},
		{
			heading: 'En bref',
			id: 'section-en-bref',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-en-bref'>
					<p>
						Nous avons estimé le potentiel solaire des établissements scolaires publics
						en France à partir de <strong>données ouvertes et officielles</strong> (IGN,
						Éducation nationale, monuments protégés).
					</p>
					<p>Concrètement :</p>
					<ul className='list-inside list-disc'>
						<li>
							<a
								className={linkStyle}
								href='#h-methode-pour-identifier-les-batiments-dun-etablissement-scolaire'
							>
								Identifier les bâtiments
							</a>{' '}
							→ croisement de la base des établissements scolaires avec les zones à
							activités éducatives et les bâtiments cartographiés par l’IGN.
						</li>
						<li>
							<a
								className={linkStyle}
								href='#h-calcul-de-la-surface-exploitable-maximum'
							>
								Évaluer la surface exploitable
							</a>{' '}
							→ sur la base de tests approfondis (méthode détaillée appliquée à 7 %
							des établissements et source externe), on estime qu’en moyenne{' '}
							<strong>un ratio de 0.6 de la surface au sol</strong> peut accueillir
							des panneaux solaires.
						</li>
						<li>
							<a
								className={linkStyle}
								href='#h-equivalent-a-la-consommation-electrique-annuel'
							>
								Estimer la production
							</a>{' '}
							→ grâce à l’API européenne PVGIS, qui fournit une estimation
							standardisée.
						</li>
						<li>
							<a
								className={linkStyle}
								href='#h-methode-pour-determiner-si-un-etablissement-scolaire-est-protege'
							>
								Prendre en compte les contraintes patrimoniales
							</a>{' '}
							→ une école située à moins de 500 m d’un monument protégé est considérée
							comme soumise à des règles spécifiques d’aménagement.
						</li>
					</ul>
					<p>
						Cette approche volontairement simplifiée permet d’obtenir une estimation{' '}
						<strong>éco-conçue transparente et comparable</strong> à l’échelle
						nationale. Elle ne remplace pas une étude technique détaillée, mais
						constitue une{' '}
						<strong>
							première base solide pour sensibiliser, comparer les territoires et
							encourager le solaire sur le bâti scolaire
						</strong>
						.
					</p>
				</section>,
				<p className='my-10'>
					Toutes les données utilisées et produites le sont en open source, le code est{' '}
					<a
						href='https://github.com/dataforgoodfr/13_potentiel_solaire'
						target='_blank'
						rel='noopener noreferrer nofollow'
						className={linkStyle}
					>
						disponible ici
						<span className='sr-only'>(ouvre un nouvel onglet)</span>
					</a>
					.
				</p>,
			],
		},
		{
			heading: 'Data',
			id: 'section-data',
			paragraphs: [
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-sources-des-donnees-utilisees'
				>
					Sources des données utilisées
				</h3>,
				<h4 className='mb-2 mt-4 text-[1.125rem] font-semibold' id='h-bd-topor-de-lign'>
					<a
						href='https://geoservices.ign.fr/bdtopo'
						target='_blank'
						rel='noopener noreferrer nofollow'
						className={linkStyle}
					>
						BD TOPO® de l’IGN
						<span className='sr-only'>(ouvre un nouvel onglet)</span>
					</a>
				</h4>,
				<section className='space-y-4' aria-labelledby='h-bd-topor-de-lign'>
					<p>Deux couches principales sont exploitées :</p>
					<ul className='list-inside list-disc'>
						<li>
							<em>Bâtiments</em> : permet de localiser précisément les constructions
							sur le territoire.
						</li>
						<li>
							<em>Zones d’activités et d’intérêts</em> : filtrée sur la catégorie «
							Science et enseignement » et les natures « Collège », « Lycée », «
							Enseignement primaire », afin d’identifier les emprises des
							établissements scolaires.
						</li>
					</ul>
					<p> Les données datent de mars 2025.</p>
				</section>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-annuaire-des-etablissements-scolaires'
				>
					<a
						href='https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/information/?disjunctive.type_etablissement&amp;disjunctive.libelle_academie&amp;disjunctive.libelle_region&amp;disjunctive.ministere_tutelle&amp;disjunctive.appartenance_education_prioritaire&amp;disjunctive.nom_commune&amp;disjunctive.code_postal&amp;disjunctive.code_departement&amp;disjunctive.libelle_departement'
						target='_blank'
						rel='noopener noreferrer nofollow'
						className={linkStyle}
					>
						Annuaire des établissements scolaires
						<span className='sr-only'>(ouvre un nouvel onglet)</span>
					</a>
				</h4>,
				<section
					className='space-y-4'
					aria-labelledby='h-annuaire-des-etablissements-scolaires'
				>
					<p>
						Cette base recense tous les établissements scolaires. Nous avons filtré les
						données pour ne retenir que les établissements au statut
						<em>Public</em> et de type « École », « Collège » ou « Lycée ». Ainsi
						filtrées, on les appellera zones d’éducation.
					</p>
					<p>
						Les données utilisées datent d’avril 2025, il est possible que celles-ci
						aient évoluées depuis.
					</p>
				</section>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-liste-des-immeubles-proteges'
				>
					<a
						href='https://data.culturecommunication.gouv.fr/explore/dataset/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/information/?disjunctive.departement_en_lettres'
						target='_blank'
						rel='noopener noreferrer nofollow'
						className={linkStyle}
					>
						Liste des immeubles protégés
						<span className='sr-only'>(ouvre un nouvel onglet)</span>
					</a>
				</h4>,
				<section className='space-y-4' aria-labelledby='h-liste-des-immeubles-proteges'>
					<p>
						Pour identifier les zones concernées par un avis conforme d’un architecte
						des bâtiments de France (ABF) avant l’installation de panneaux solaires.
					</p>
					<p>
						Les données utilisées datent d’avril 2025, il est possible que celles-ci
						aient légèrement évoluées depuis.
					</p>
				</section>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-modeles-numeriques-de-surfaces-correles'
				>
					<a
						href='https://geoservices.ign.fr/modeles-numeriques-de-surfaces-correles'
						target='_blank'
						rel='noopener noreferrer nofollow'
						className={linkStyle}
					>
						Modèles Numériques de Surfaces correlés
						<span className='sr-only'>(ouvre un nouvel onglet)</span>
					</a>
				</h4>,
				<section
					className='space-y-4'
					aria-labelledby='h-modeles-numeriques-de-surfaces-correles'
				>
					<p>
						Un MNS (modèle numérique de surface) décrit la forme du sol et du sursol du
						territoire. En plus du terrain, ce maillage régulier fournit l’altitude de
						l’ensemble des éléments au-dessus du sol comme la végétation, les bâtiments
						ou les ouvrages d&apos;art.&nbsp;
						<br />
						Il est produit par « corrélation des images aériennes » acquises pour mettre
						à jour la BD ORTHO®. &nbsp;Pour chaque département, on obtient donc une
						modélisation du sol et sursol cohérente et de même actualité que
						l’orthoimage correspondante.
					</p>
					<p>
						Il a été utilisé pour segmenter précisément les toits sur leur pente &amp;
						orientation lors de la phase de calibration du calcul de la surface
						exploitable maximum d’un bâtiment.
					</p>
					<p>
						Les données ont été récupérées via les flux WMS mis à disposition par l’IGN
						(septembre 2025).
					</p>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-methode-pour-identifier-les-batiments-dun-etablissement-scolaire'
				>
					Méthode pour identifier les bâtiments d’un établissement scolaire
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='h-methode-pour-identifier-les-batiments-dun-etablissement-scolaire'
				>
					<p>
						Pour chaque établissement scolaire, nous utilisons son identifiant issu de
						l’annuaire des établissements afin de l’associer à une zone d’éducation
						extraite de la BD TOPO. L’emprise géographique de cette zone d’éducation
						nous permet ensuite d’identifier les bâtiments qui s’y trouvent : nous
						réalisons une intersection spatiale entre la zone et les bâtiments
						référencés dans la BD TOPO.
					</p>
					<p>
						Dans la grande majorité des cas, cette méthode permet de relier précisément
						chaque établissement à ses bâtiments. Il arrive toutefois que la zone
						d’éducation ne soit pas trouvée pour certains établissements (moins de 3 %
						des cas).
					</p>
					<p>
						Parfois, plusieurs zones d’éducation se superposent : cela correspond
						généralement à des établissements scolaires qui partagent des bâtiments
						communs (par exemple, un collège et un lycée sur un même site). Dans ce cas,
						les établissements sont regroupés, et les résultats des calculs sont
						affichés au niveau de la zone partagée, et non pour chaque établissement
						individuellement.
					</p>
					<p>
						Enfin, il peut arriver qu’aucun bâtiment n’intersecte la zone d’éducation :
						dans ce cas, le calcul du potentiel solaire n’est pas possible pour
						l’établissement concerné.
					</p>
				</section>,
				<h4 className='mb-2 mt-4 text-[1.125rem] font-semibold' id='h-limites'>
					Limites
				</h4>, //TODO: specific lower heading style
				<section className='space-y-4' aria-labelledby='h-limites'>
					<ul className='list-inside list-disc'>
						<li>
							Certains établissements peuvent ne pas être associés à une zone
							d’éducation, ou à des bâtiments, ce qui empêche le calcul du potentiel
							solaire.
						</li>
						<li>
							Les regroupements d’établissements sur une même zone peuvent masquer des
							spécificités propres à chaque structure.
						</li>
					</ul>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-methode-pour-determiner-si-un-etablissement-scolaire-est-protege'
				>
					Méthode pour déterminer si un établissement scolaire est protégé
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='h-methode-pour-determiner-si-un-etablissement-scolaire-est-protege'
				>
					<p>
						Un établissement scolaire est considéré comme « protégé » si au moins un de
						ses bâtiments se situe à moins de 500 mètres d’un immeuble protégé. Cette
						règle s’appuie sur les prescriptions d’aménagement des Architectes des
						Bâtiments de France (cf{' '}
						<a
							href='https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006177322/2012-04-15/'
							target='_blank'
							rel='noopener noreferrer nofollow'
							className={linkStyle}
						>
							ici
							<span className='sr-only'>(ouvre un nouvel onglet)</span>
						</a>
						), qui imposent des contraintes spécifiques dans un périmètre de 500 mètres
						autour des monuments protégés.
					</p>
					<p>
						A noter que le critère de visibilité du monument n’a pas été pris en compte
						dans la méthode et que des établissements marqués comme « protégés »
						pourraient ne pas l’être en réalité.
					</p>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-calcul-de-la-surface-exploitable-maximum'
				>
					Calcul de la surface exploitable maximum
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='h-calcul-de-la-surface-exploitable-maximum'
				>
					<p>
						Pour chaque bâtiment attaché à une école, nous estimons la surface
						exploitable maximum pour l’installation de panneaux solaires. Nous faisons
						l’hypothèse que cette surface équivaut à 0.6 x la surface totale au sol d’un
						bâtiment.
					</p>
					<p>
						Ce coefficient tient compte, de façon simplifiée et moyennée, des éléments
						qui réduisent la surface exploitable maximum : segments de toits présentant
						une irradiation annuelle trop faible (liée à leur pente et orientation),
						obstacles, équipements techniques, etc.
					</p>
				</section>,
				//TODO: specific lower heading style
				<h4 className='mb-2 mt-4 text-[1.125rem] font-semibold' id='h-limites-1'>
					Limites
				</h4>,
				<section className='space-y-4' aria-labelledby='h-limites-1'>
					<ul className='list-inside list-disc'>
						<li>
							La proportionnalité entre surface au sol et surface exploitable maximum
							est une approximation : à l’échelle d’un bâtiment, la forme du toit, sa
							pente et son orientation peuvent fortement influencer le potentiel réel.
						</li>
					</ul>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-calcul-du-potentiel-solaire'
				>
					Calcul du potentiel solaire
				</h3>,
				<section className='space-y-4' aria-labelledby='h-calcul-du-potentiel-solaire'>
					<p>
						Le potentiel solaire est ensuite estimé à l’aide de l’API européenne{' '}
						<a
							href='https://re.jrc.ec.europa.eu/pvg_tools/fr/'
							target='_blank'
							rel='noopener noreferrer nofollow'
							className={linkStyle}
						>
							PVGIS
							<span className='sr-only'>(ouvre un nouvel onglet)</span>
						</a>
						, en faisant l’hypothèse que chaque toit est plat. L’API optimise
						automatiquement les paramètres de pente et d’orientation en fonction de la
						localisation du bâtiment (cela revient à supposer qu’on peut mettre les
						panneaux sur un support ajustable). Pour simplifier, nous considérons que
						l’irradiation par m² est identique pour tous les bâtiments d’un même
						département.
					</p>
					<p>
						Nous utilisons les valeurs par défaut de l’API PVGIS : une puissance
						installée de <strong>225 W/m²</strong> et des pertes de{' '}
						<strong>14 %</strong>.
					</p>
					<p>
						On obtient une estimation du potentiel de production solaire annuel (en
						kWh/an). Pour un établissement scolaire, il correspond à la somme des
						potentiels solaires des bâtiments qui lui ont été associés.
					</p>
				</section>,
				// TODO: specific lower heading style
				<h4 className='mb-2 mt-4 text-[1.125rem] font-semibold' id='h-limites-2'>
					Limites
				</h4>,
				<section className='space-y-4' aria-labelledby='h-limites-2'>
					<ul className='list-inside list-disc'>
						<li>
							100 % de la surface exploitable ne sera pas nécessairement utilisée pour
							l’installation de panneaux solaires
						</li>
						<li>
							La diversité des technologies de panneaux installés entraînera des
							rendements variables
						</li>
						<li>
							L’hypothèse de toits plats optimisant la pente et l’orientation n’est
							pas toujours réaliste : de nombreux bâtiments présentent des toitures
							inclinées ou orientées de façon sous-optimale, ce qui peut réduire la
							production réelle par rapport à l’estimation.
						</li>
					</ul>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-evaluation-de-la-qualite-des-resultats'
				>
					Evaluation de la qualité des résultats
				</h3>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-construction-de-lechantillon'
				>
					Construction de l’échantillon
				</h4>,
				<section className='space-y-4' aria-labelledby='h-construction-de-lechantillon'>
					<p>
						L’échantillon de bâtiments scolaires retenu pour l’évaluation de la méthode
						a été construit à partir du potentiel solaire calculé avec la méthode
						simplifiée décrite ci-dessus.
					</p>
					<p>
						L’objectif principal était de permettre à Greenpeace France de vérifier la
						pertinence de la méthode simplifiée sur les établissements susceptibles de
						faire l’objet de leurs actions prioritaires.
					</p>
					<p>
						La sélection des établissements prioritaires s’est appuyée sur les critères
						suivants :
					</p>
					<ul className='list-inside list-disc'>
						<li>Uniquement des établissements non considérés comme protégés</li>
						<li>Le top 10 par région et par type d’établissement</li>
						<li>Le top 10 par département et par type d’établissement</li>
						<li>
							Le top 10 par type d’établissement au niveau des villes prioritaires :
							<ul className='ml-6 list-inside list-disc'>
								<li>40 villes de plus de 100 000 habitants.</li>
								<li>
									10 villes de moins de 100 000 habitants dans lesquelles un
									groupe local Greenpeace France est actif : Chambéry, Blois, La
									Rochelle, Montélimar, Narbonne, Orsay, Poitiers, Sète, Troyes,
									Versailles. Filtres appliqués : Exclusion des bâtiments protégés
									et des établissements sans potentiel solaire positif.
								</li>
							</ul>
						</li>
						<li>
							Le top 100 des établissements étant les seuls établissements scolaires
							de leur commune
						</li>
					</ul>
					<p>
						Cette échantillon représente près de 7% des établissements scolaires
						publiques (3517).
					</p>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-calculs-detailles-effectues-sur-lechantillon'
				>
					Calculs détaillés effectués sur l’échantillon
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='h-calculs-detailles-effectues-sur-lechantillon'
				>
					<ul className='list-inside list-disc'>
						<li>
							Une segmentation fine des toitures a été réalisée à partir des données
							de Modèle Numérique de Surface (MNS), chaque segment étant homogène en
							pente et orientation.
						</li>
						<li>
							Le potentiel solaire a été calculé en utilisant l’API{' '}
							<strong>
								<a
									href='https://re.jrc.ec.europa.eu/pvg_tools/fr/'
									target='_blank'
									rel='noopener noreferrer nofollow'
									className={linkStyle}
								>
									PVGIS
									<span className='sr-only'>(ouvre un nouvel onglet)</span>
								</a>
							</strong>{' '}
							en prenant en compte pente et orientation de chaque segment.
						</li>
						<li>
							Enfin, seuls les segments de plus de 2 m² et présentant une irradiation
							annuelle supérieure à 900 kWh/m² ont été retenus pour calculer la
							surface exploitable maximum et le potentiel total du bâtiment.
						</li>
					</ul>
				</section>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-resultats-de-levaluation'
				>
					Résultats de l’évaluation
				</h4>,
				<section className='space-y-4' aria-labelledby='h-resultats-de-levaluation'>
					<p> Sur cet échantillon, on a pu constater :</p>
					<ul className='list-inside list-disc'>
						<li>
							un ratio moyen de 0.59 entre la surface exploitable calculée via la
							segmentation des toits et la surface au sol
						</li>
						<li>57% de la surface des toits est plane</li>
						<li>
							un écart moyen de 8.7% sur le potentiel solaire entre les deux méthodes
						</li>
						<li>
							à la maille des établissements, les résultats des deux méthodes sont
							fortement linéairement corrélés (R² = 0.901)
						</li>
					</ul>
					<p>
						Nous avons également comparé nos résultats avec une{' '}
						<a
							href='https://data.opendatasoft.com/explore/dataset/le-potentiel-solaire-des-toitures%40datailedefrance/information/?flg=fr-fr'
							target='_blank'
							rel='noopener noreferrer nofollow'
							className={linkStyle}
						>
							base de données d’Île-de-France
							<span className='sr-only'>(ouvre un nouvel onglet)</span>
						</a>
						. Sur les bâtiments en commun avec notre étude (environ 1800 bâtiments
						scolaires en Île-de-France), on a pu constater :
					</p>
					<ul className='list-inside list-disc'>
						<li>
							un ratio moyen de 0.51 entre la surface exploitable et la surface au sol
							(sur les données IdF)
						</li>
						<li>
							une forte corrélation linéaire avec le calcul de surface exploitable par
							segmentation (R² = 0.956 et un écart moyen de 3.7%)
						</li>
						<li>
							le potentiel solaire n’a pu être comparé car les hypothèses sur les
							modules installés et leurs rendements de leurs calculs de potentiel
							solaire sont inconnus
						</li>
					</ul>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='#h-equivalent-a-la-consommation-electrique-annuel'
				>
					Équivalent à la consommation électrique annuel
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='#h-equivalent-a-la-consommation-electrique-annuel'
				>
					<p>
						Afin de faciliter l’interprétation des résultats, pour chaque établissement
						scolaire, on divise son potentiel solaire par 5000.
					</p>
					<p>
						On suppose 5 000 kWh/an de consommation électrique pour un foyer de 2
						personnes car :
					</p>
					<ul className='list-inside list-disc'>
						<li>
							la consommation d&apos;électricité moyenne d&apos;une personne en France
							était de 2 223 kWh/personne/an selon les données de l’agence ORE
							(Opérateurs de Réseaux d’Energie) (Source :
							<a
								href='https://www.data.gouv.fr/fr/reuses/consommation-par-habitant-et-par-ville-delectricite-en-france/'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								repris sur base de données data gouv
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
							)
						</li>
						<li>
							la taille moyenne d&apos;un foyer était de 2.16 personnes en 2021{' '}
							<a
								href='https://www.insee.fr/fr/statistiques/2381486'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								selon l&apos;Insee
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
						</li>
						<li>
							si on se base sur les données de RTE : 160 TWh de consommation du
							secteur résidentiel en 2019 (page 100{' '}
							<a
								href='https://assets.rte-france.com/prod/public/2022-06/FE2050%20_Rapport%20complet_3.pdf'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								de ce document
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>{' '}
							- PDF de 6.2Mo) et avec 29.2 millions de foyers en 2019 (source :{' '}
							<a
								href='https://www.insee.fr/fr/statistiques/6455805?sommaire=6455840&amp;geo=METRO-1'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								insee
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
							), on obtient 5 479 kWh de consommation par foyer et par an
						</li>
					</ul>
				</section>,
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-pourquoi-avoir-utilise-une-methode-de-calcul-simplifiee'
				>
					Pourquoi avoir utilisé une méthode de calcul simplifiée ?
				</h3>,
				<section
					className='space-y-4'
					aria-labelledby='h-pourquoi-avoir-utilise-une-methode-de-calcul-simplifiee'
				>
					<p>
						Le choix d’une méthode de calcul simplifiée répond à plusieurs objectifs :
					</p>
					<ul className='list-inside list-disc'>
						<li>
							<strong>Éco-conception et sobriété numérique</strong>
							<br />
							En limitant la complexité des calculs, nous réduisons la consommation de
							ressources informatiques et l’empreinte carbone liée au traitement des
							données.
						</li>
						<li>
							<strong>
								Limites structurelles et réglementaires difficiles à intégrer à
								grande échelle
							</strong>
							<br />
							Au-delà des aspects de forme des toits, de nombreux autres facteurs
							influencent la faisabilité réelle d’un projet d’installation de panneaux
							solaires :
							<ul className='ml-6 list-inside list-disc'>
								<li>les ombres des bâtiments &amp; végétations adjacents</li>
								<li>
									la puissance de raccordement disponible sur le réseau de
									distribution (Enedis)
								</li>
								<li>
									la faisabilité économique : même si une grande surface est
									exploitable, il est possible que des panneaux soient installés
									sur une surface plus petite
								</li>
								<li>
									la validation des Architectes des Bâtiments de France (ABF) si
									l’établissement est proche d’un bâtiment protégé
								</li>
								<li>
									la structure du toit et sa capacité à supporter le poids
									supplémentaire des panneaux
								</li>
								<li>et bien d’autres contraintes techniques ou administratives.</li>
							</ul>
						</li>
						<li>
							<strong>Accessibilité et transparence</strong>
							<br />
							Nous souhaitons fournir une information claire, compréhensible et
							facilement interprétable par tous : citoyens, élus, journalistes,
							professionnels ou simples curieux. Une méthode simplifiée permet de
							rendre les résultats accessibles sans nécessiter de connaissances
							techniques pointues.
						</li>
						<li>
							<strong>Couverture nationale et comparabilité</strong>
							<br />
							Cette approche permet de traiter rapidement l’ensemble du territoire et
							d’assurer une homogénéité des résultats, facilitant ainsi la comparaison
							entre établissements et entre territoires.
						</li>
						<li>
							<strong>Actualisation régulière</strong>
							<br />
							La simplicité de la méthode permettrait de mettre à jour les résultats
							facilement.
						</li>
						<li>
							<strong>Sensibilisation et action</strong>
							<br />
							L’objectif principal est de sensibiliser le grand public et les
							décideurs au potentiel du solaire dans les écoles, et d’encourager la
							réflexion et l’action en faveur de la transition énergétique.
						</li>
					</ul>
					<p>
						Bien entendu, ces estimations ne remplacent pas une étude de faisabilité
						technique détaillée, indispensable avant tout projet d’installation. Mais
						elles constituent une première étape pour visualiser le potentiel et engager
						la discussion à grande échelle.
					</p>
				</section>,
			],
		},
		{
			heading: 'Web',
			id: 'section-web',
			paragraphs: [
				<h3
					className='mb-2 mt-5 text-[1.25rem] font-semibold'
					id='h-leco-conception-au-coeur-du-projet'
				>
					L’eco-conception au cœur du projet
				</h3>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-pourquoi-un-site-eco-concu'
				>
					Pourquoi un site éco-conçu ?
				</h4>,
				<section className='space-y-4' aria-labelledby='h-pourquoi-un-site-eco-concu'>
					<p>
						Pour accompagner la démarche de Greenpeace France, visant une utilisation
						par les collectivités publiques des énergies renouvelables, et ce de manière
						plus responsable (avec une sobriété énergétique, comme le préconise par
						exemple le scénario NégaWatt), la réalisation de l’outil Établissement
						solaire a pris en compte un certain nombre de critères d’éco-conception
						(pour la plupart issus du RGESN). Ceci afin de limiter l’impact énergétique
						et carbone de cet outil numérique.
						<br />
						Ce choix de conception intervient à tous les niveaux, nous l’avons vu pour
						la partie Data, avec l’utilisation d’une méthode de calcul simplifié. C’est
						aussi le cas au niveau de la conception web (UX-UI-Front end).
					</p>
				</section>,
				<h4
					className='mb-2 mt-4 text-[1.125rem] font-semibold'
					id='h-criteres-mis-en-place'
				>
					Critères mis en place
				</h4>,
				<h5 className='mb-1 mt-3 text-[1rem] font-semibold' id='h-mobile-first'>
					Mobile first
				</h5>,
				<p>
					En prenant le format mobile comme base de conception, nous ne nous focalisons
					que sur l’essentiel et développons des composants plus facilement réutilisables
					permettant une économie de moyens.
				</p>,
				<h5 className='mb-1 mt-3 text-[1rem] font-semibold' id='h-composants-et-animations'>
					Composants et animations
				</h5>,
				<p>
					L’utilisation d’icônes et de fonds de carte vectoriels diminuent le poids de la
					page et permettent de meilleures performances d’affichage côté utilisateur. Le
					clustering des marqueurs d’établissement et l’affichage progressif des
					informations sur la carte, permet de réduire le nombre d’objets affichés lorsque
					celle-ci est zoomée. Les animations sont limitées (comme le zoom sur la carte)
					même si des compromis ont été fait pour garantir confort d’utilisation et
					accessibilité.
				</p>,
				<h5 className='mb-1 mt-3 text-[1rem] font-semibold' id='h-parcours-optimises'>
					Parcours optimisés
				</h5>,
				<p>
					En limitant de nombre de pages et d’écrans à afficher (pas d’entrées par profils
					cibles), le parcours de l’utilisateur est facilité tout en réduisant la charge
					du serveur.
				</p>,
				<h5 className='mb-1 mt-3 text-[1rem] font-semibold' id='h-dark-mode'>
					Dark mode
				</h5>,
				<p>
					L’utilisation de couleur de fonds sombres permet une économie d’énergie en
					affichant moins de zones très lumineuses comme les fonds clairs par exemple.
					Encore une fois un compromis a été choisi pour garantir une bonne lisibilité
					(notamment de jour) sur les fiches.
				</p>,
				<h5 className='mb-1 mt-3 text-[1rem] font-semibold' id='h-formulaire-free'>
					Formulaire-free
				</h5>,
				<p>
					Nous avons fait en sorte de ne pas utiliser de formulaire pour réduire l’envoi
					de données. Des redirections mails sont par exemple utilisés à la place des
					formulaires de contact.
				</p>,
				<h5
					className='mb-1 mt-3 text-[1rem] font-semibold'
					id='h-utilisation-de-police-systeme'
				>
					Utilisation de police système
				</h5>,
				<p>
					En utilisant une police pré-installée dans le terminal, ici Verdana,
					l’utilisateur n’a pas besoin d’en télécharger une supplémentaire, réduisant la
					consommation de la bande passante et accélérant le chargement du site.
				</p>,
				<h4 className='mb-2 mt-4 text-[1.125rem] font-semibold' id='h-resultats'>
					Résultats
				</h4>,
				<section className='space-y-4' aria-labelledby='h-resultats'>
					<p>
						Moins d’1,5Kg de CO2e et 21,9L d’eau consommés pour 1000 visites, ce qui en
						fait un site avec une performance environnementale plus que satisfaisante.{' '}
						<br />
						Ainsi l’outil Établissement solaire participe à la transition énergétique en
						limitant son empreinte.
						<br />
					</p>
					<p>
						<strong>Quelques rapports d’évaluations effectuées :</strong>
					</p>
					<ul className='list-inside list-disc'>
						<li>
							<a
								href='https://pagespeed.web.dev/analysis/https-d4g-13-potentiel-solaire-services-dataforgood-fr/seoz0u0g7b?form_factor=mobile&amp;category=performance&amp;category=accessibility&amp;category=best-practices&amp;category=seo&amp;hl=fr&amp;utm_source=lh-chrome-ext'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								Google Lighthouse
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
						</li>
						<li>
							<a
								href='https://www.ecoindex.fr/resultat/?id=9e652064-f602-4475-bea9-c83f82880dc1'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								Eco-index
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
						</li>
						<li>
							<a
								href='https://kastor.green/audit-result/86f84e86-c6d4-44c8-b708-08ddf9386da9/ecodesign'
								target='_blank'
								rel='noopener noreferrer nofollow'
								className={linkStyle}
							>
								Kastor
								<span className='sr-only'>(ouvre un nouvel onglet)</span>
							</a>
						</li>
					</ul>
				</section>,
			],
		},
	],
};

export default notreMethodologieContent;
