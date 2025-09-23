import type { StaticPageProps } from '../StaticPage';

const notreMethodologieContent: StaticPageProps = {
	title: 'Notre méthodologie',
	sections: [
		{
			heading: 'Sommaire',
			paragraphs: [
				<ol key='1' className='list-inside list-decimal'>
					<li>
						<a href='#section-en-bref'>En bref</a>
					</li>
					<li>
						<a href='#section-data'>Data</a>
					</li>
					<li>
						<a href='#section-web'>Web</a>
					</li>
				</ol>,
			],
		},
		{
			heading: 'En bref',
			id: 'section-en-bref',
			paragraphs: [
				<>
					<p key='1'>
						Nous avons estimé le potentiel solaire des établissements scolaires publics
						en France à partir de <strong>données ouvertes et officielles</strong> (IGN,
						Éducation nationale, monuments protégés).
					</p>
					<p key='2'>Concrètement :</p>
					<ul key='3' className='list-inside list-disc'>
						<li>
							<strong>
								<a href='https://outline.services.dataforgood.fr/doc/wip-methodologie-N4mdPyS06Z#h-methode-pour-identifier-les-batiments-dun-etablissement-scolaire'>
									Identifier les bâtiments
								</a>
							</strong>{' '}
							→ croisement de la base des établissements scolaires avec les zones à
							activités éducatives et les bâtiments cartographiés par l’IGN.
						</li>
						<li>
							<strong>
								<a href='https://outline.services.dataforgood.fr/doc/wip-methodologie-N4mdPyS06Z#h-calcul-de-la-surface-exploitable-maximum'>
									Évaluer la surface exploitable
								</a>
							</strong>{' '}
							→ sur la base de tests approfondis (méthode détaillée appliquée à 7 %
							des établissements et source externe), on estime qu’en moyenne{' '}
							<strong>un ratio de 0.6 de la surface au sol</strong> peut accueillir
							des panneaux solaires.
						</li>
						<li>
							<strong>
								<a href='https://outline.services.dataforgood.fr/doc/wip-methodologie-N4mdPyS06Z#h-equivalent-a-la-consommation-electrique-annuel'>
									Estimer la production
								</a>
							</strong>{' '}
							→ grâce à l’API européenne PVGIS, qui fournit une estimation
							standardisée.
						</li>
						<li>
							<strong>
								<a href='/doc/wip-methodologie-N4mdPyS06Z'>
									Prendre en compte les contraintes patrimoniales
								</a>
							</strong>{' '}
							→ une école située à moins de 500 m d’un monument protégé est considérée
							comme soumise à des règles spécifiques d’aménagement.
						</li>
					</ul>
					<p key='4'>
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
					<p key='5'>
						Toutes les données utilisées et produites le sont en open source, le code
						est{' '}
						<a
							href='https://github.com/dataforgoodfr/13_potentiel_solaire'
							target='_blank'
							rel='noopener noreferrer nofollow'
						>
							disponible ici
						</a>
						.
					</p>
				</>,
			],
		},
		{
			heading: 'Data',
			id: 'section-data',
			paragraphs: [
				<h3 className='mb-2 mt-5 text-xl font-semibold'>Sources des données utilisées</h3>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>
						<a
							href='https://geoservices.ign.fr/bdtopo'
							target='_blank'
							rel='noopener noreferrer nofollow'
						>
							BD TOPO® de l’IGN
						</a>
					</h4>
					<p>Deux couches principales sont exploitées :</p>
					<ul>
						<li>
							<p>
								<em>Bâtiments</em> : permet de localiser précisément les
								constructions sur le territoire.
							</p>
						</li>
						<li>
							<p>
								<em>Zones d’activités et d’intérêts</em> : filtrée sur la catégorie
								« Science et enseignement » et les natures « Collège », « Lycée »,
								« Enseignement primaire », afin d’identifier les emprises des
								établissements scolaires.
							</p>
						</li>
					</ul>
					<p> Les données datent de mars 2025.</p>
				</>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>
						<a
							href='https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/information/?disjunctive.type_etablissement&amp;disjunctive.libelle_academie&amp;disjunctive.libelle_region&amp;disjunctive.ministere_tutelle&amp;disjunctive.appartenance_education_prioritaire&amp;disjunctive.nom_commune&amp;disjunctive.code_postal&amp;disjunctive.code_departement&amp;disjunctive.libelle_departement'
							target='_blank'
							rel='noopener noreferrer nofollow'
						>
							Annuaire des établissements scolaires
						</a>
					</h4>
					<p>
						Cette base recense tous les établissements scolaires. Nous avons filtré les
						données pour ne retenir que les établissements au statut
						<em>Public</em> et de type « École », « Collège » ou « Lycée ». Ainsi
						filtrées, on les appellera zones d’éducation.
					</p>
					<p>
						Les données utilisées datent d’avril 2025, il est possible que celles-ci
						aient évoluées depuis.
					</p>
				</>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>
						<a
							href='https://data.culturecommunication.gouv.fr/explore/dataset/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/information/?disjunctive.departement_en_lettres'
							rel='noopener noreferrer nofollow'
						>
							Liste des immeubles protégés
						</a>
					</h4>
					<p>
						Pour identifier les zones concernées par un avis conforme d’un architecte
						des bâtiments de France (ABF) avant l’installation de panneaux solaires.
					</p>
					<p>
						Les données utilisées datent d’avril 2025, il est possible que celles-ci
						aient légèrement évoluées depuis.
					</p>
				</>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>
						<a
							href='https://geoservices.ign.fr/modeles-numeriques-de-surfaces-correles'
							rel='noopener noreferrer nofollow'
						>
							Modèles Numériques de Surfaces correlés
						</a>
					</h4>
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
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					Méthode pour identifier les bâtiments d’un établissement scolaire
				</h3>,
				<>
					<p>
						Pour chaque établissement scolaire, nous utilisons son identifiant issu de
						l’annuaire des établissements afin de l’associer à une zone d’éducation
						extraite de la BD TOPO. L’emprise géographique de cette zone d’éducation
						nous permet ensuite d’identifier les bâtiments qui s’y trouvent : nous
						réalisons une intersection spatiale entre la zone et les bâtiments
						référencés dans la BD TOPO.
					</p>
					<p>
						Dans la grande majorité des cas, cette méthode permet de relier précisément
						chaque établissement à ses bâtiments. Il arrive toutefois que la zone
						d’éducation ne soit pas trouvée pour certains établissements (moins de 3 %
						des cas).
					</p>
					<p>
						Parfois, plusieurs zones d’éducation se superposent : cela correspond
						généralement à des établissements scolaires qui partagent des bâtiments
						communs (par exemple, un collège et un lycée sur un même site). Dans ce cas,
						les établissements sont regroupés, et les résultats des calculs sont
						affichés au niveau de la zone partagée, et non pour chaque établissement
						individuellement.
					</p>
					<p>
						Enfin, il peut arriver qu’aucun bâtiment n’intersecte la zone d’éducation :
						dans ce cas, le calcul du potentiel solaire n’est pas possible pour
						l’établissement concerné.
					</p>
				</>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Limites</h4>,
				<ul>
					<li>
						<p>
							Certains établissements peuvent ne pas être associés à une zone
							d’éducation, ou à des bâtiments, ce qui empêche le calcul du potentiel
							solaire.
						</p>
					</li>
					<li>
						<p>
							Les regroupements d’établissements sur une même zone peuvent masquer des
							spécificités propres à chaque structure.
						</p>
					</li>
				</ul>,
				<>
					<h3 className='mb-2 mt-5 text-xl font-semibold'>
						<strong>
							Méthode pour déterminer si un établissement scolaire est protégé
						</strong>
					</h3>
					<p>
						Un établissement scolaire est considéré comme « protégé » si au moins un de
						ses bâtiments se situe à moins de 500 mètres d’un immeuble protégé. Cette
						règle s’appuie sur les prescriptions d’aménagement des Architectes des
						Bâtiments de France (cf{' '}
						<a
							href='https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006177322/2012-04-15/'
							rel='noopener noreferrer nofollow'
						>
							ici
						</a>
						), qui imposent des contraintes spécifiques dans un périmètre de 500 mètres
						autour des monuments protégés.
					</p>
					<p>
						A noter que le critère de visibilité du monument n’a pas été pris en compte
						dans la méthode et que des établissements marqués comme « protégés »
						pourraient ne pas l’être en réalité.
					</p>
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					<strong>Calcul de la surface exploitable maximum</strong>
				</h3>,
				<>
					<p>
						Pour chaque bâtiment attaché à une école, nous estimons la surface
						exploitable maximum pour l’installation de panneaux solaires. Nous faisons
						l’hypothèse que cette surface équivaut à 0.6 x la surface totale au sol d’un
						bâtiment.
					</p>
					<p>
						Ce coefficient tient compte, de façon simplifiée et moyennée, des éléments
						qui réduisent la surface exploitable maximum : segments de toits présentant
						une irradiation annuelle trop faible (liée à leur pente et orientation),
						obstacles, équipements techniques, etc.
					</p>
				</>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>Limites </h4>
					<ul>
						<li>
							<p>
								La proportionnalité entre surface au sol et surface exploitable
								maximum est une approximation : à l’échelle d’un bâtiment, la forme
								du toit, sa pente et son orientation peuvent fortement influencer le
								potentiel réel.
							</p>
						</li>
					</ul>
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					<strong>Calcul du potentiel solaire</strong>
				</h3>,
				<>
					<p>
						Le potentiel solaire est ensuite estimé à l’aide de l’API européenne
						<strong>
							<a
								href='https://re.jrc.ec.europa.eu/pvg_tools/fr/'
								rel='noopener noreferrer nofollow'
							>
								PVGIS
							</a>
						</strong>
						, en faisant l’hypothèse que chaque toit est plat. L’API optimise
						automatiquement les paramètres de pente et d’orientation en fonction de la
						localisation du bâtiment (cela revient à supposer qu’on peut mettre les
						panneaux sur un support ajustable). Pour simplifier, nous considérons que
						l’irradiation par m² est identique pour tous les bâtiments d’un même
						département.
					</p>
					<p>
						Nous utilisons les valeurs par défaut de l’API PVGIS : une puissance
						installée de <strong>225 W/m²</strong> et des pertes de
						<strong>14 %</strong>.
					</p>
					<p>
						On obtient une estimation du potentiel de production solaire annuel (en
						kWh/an). Pour un établissement scolaire, il correspond à la somme des
						potentiels solaires des bâtiments qui lui ont été associés.
					</p>
				</>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Limites</h4>,
				<>
					<ul>
						<li>
							<p>
								100 % de la surface exploitable ne sera pas nécessairement utilisée
								pour l’installation de panneaux solaires
							</p>
						</li>
						<li>
							<p>
								La diversité des technologies de panneaux installés entraînera des
								rendements variables
							</p>
						</li>
						<li>
							<p>
								L’hypothèse de toits plats optimisant la pente et l’orientation
								n’est pas toujours réaliste : de nombreux bâtiments présentent des
								toitures inclinées ou orientées de façon sous-optimale, ce qui peut
								réduire la production réelle par rapport à l’estimation.
							</p>
						</li>
					</ul>
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					Evaluation de la qualité des résultats
				</h3>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Construction de l’échantillon</h4>,
				<>
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
						suivants :
					</p>
				</>,
				<ul>
					<li>
						<p>Uniquement des établissements non considérés comme protégés</p>
					</li>
					<li>
						<p> Le top 10 par région et par type d’établissement</p>
					</li>
					<li>
						<p> Le top 10 par département et par type d’établissement</p>
					</li>
					<li>
						<p>
							Le top 10 par type d’établissement au niveau des villes prioritaires :
						</p>
						<ul>
							<li>
								<p> 40 villes de plus de 100 000 habitants.</p>
							</li>
							<li>
								<p>
									10 villes de moins de 100 000 habitants dans lesquelles un
									groupe local Greenpeace France est actif : Chambéry, Blois, La
									Rochelle, Montélimar, Narbonne, Orsay, Poitiers, Sète, Troyes,
									Versailles. Filtres appliqués : Exclusion des bâtiments protégés
									et des établissements sans potentiel solaire positif.
								</p>
							</li>
						</ul>
					</li>
					<li>
						<p>
							Le top 100 des établissements étant les seuls établissements scolaires
							de leur commune
						</p>
					</li>
				</ul>,
				<p>
					Cette échantillon représente près de 7% des établissements scolaires publiques
					(3517).
				</p>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					<strong>Calculs détaillés effectués sur l’échantillon</strong>
				</h3>,
				<ul>
					<li>
						<p>
							Une segmentation fine des toitures a été réalisée à partir des données
							de Modèle Numérique de Surface (MNS), chaque segment étant homogène en
							pente et orientation.
						</p>
					</li>
					<li>
						<p>
							Le potentiel solaire a été calculé en utilisant l’API{' '}
							<strong>
								<a
									href='https://re.jrc.ec.europa.eu/pvg_tools/fr/'
									rel='noopener noreferrer nofollow'
								>
									PVGIS
								</a>
							</strong>
							en prenant en compte pente et orientation de chaque segment.
						</p>
					</li>
					<li>
						<p>
							Enfin, seuls les segments de plus de 2 m² et présentant une irradiation
							annuelle supérieure à 900 kWh/m² ont été retenus pour calculer la
							surface exploitable maximum et le potentiel total du bâtiment.
						</p>
					</li>
				</ul>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Résultats de l’évaluation</h4>,
				<>
					<p> Sur cet échantillon, on a pu constater :</p>
					<ul>
						<li>
							<p>
								un ratio moyen de 0.59 entre la surface exploitable calculée via la
								segmentation des toits et la surface au sol
							</p>
						</li>
						<li>
							<p> 57% de la surface des toits est plane</p>
						</li>
						<li>
							<p>
								un écart moyen de 8.7% sur le potentiel solaire entre les deux
								méthodes
							</p>
						</li>
						<li>
							<p>
								à la maille des établissements, les résultats des deux méthodes sont
								fortement linéairement corrélés (R² = 0.901)
							</p>
						</li>
					</ul>
					<p>
						Nous avons également comparé nos résultats avec une
						<a
							href='https://data.opendatasoft.com/explore/dataset/le-potentiel-solaire-des-toitures%40datailedefrance/information/?flg=fr-fr'
							rel='noopener noreferrer nofollow'
						>
							base de données d’Île-de-France
						</a>
						. Sur les bâtiments en commun avec notre étude (environ 1800 bâtiments
						scolaires en Île-de-France), on a pu constater :
					</p>
					<ul>
						<li>
							<p>
								un ratio moyen de 0.51 entre la surface exploitable et la surface au
								sol (sur les données IdF)
							</p>
						</li>
						<li>
							<p>
								une forte corrélation linéaire avec le calcul de surface exploitable
								par segmentation (R² = 0.956 et un écart moyen de 3.7%)
							</p>
						</li>
						<li>
							<p>
								le potentiel solaire n’a pu être comparé car les hypothèses sur les
								modules installés et leurs rendements de leurs calculs de potentiel
								solaire sont inconnus
							</p>
						</li>
					</ul>
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					<strong>Équivalent à la consommation électrique annuel</strong>
				</h3>,
				<>
					<p>
						Afin de faciliter l’interprétation des résultats, pour chaque établissement
						scolaire, on divise son potentiel solaire par 5000.
					</p>
					<p>
						On suppose 5 000 kWh/an de consommation électrique pour un foyer de 2
						personnes car :
					</p>
					<ul>
						<li>
							<p>
								la consommation d&apos;électricité moyenne d&apos;une personne en
								France était de 2 223 kWh/personne/an selon les données de l’agence
								ORE (Opérateurs de Réseaux d’Energie) (Source :
								<a
									href='https://www.data.gouv.fr/fr/reuses/consommation-par-habitant-et-par-ville-delectricite-en-france/'
									rel='noopener noreferrer nofollow'
								>
									repris sur base de données data gouv
								</a>
								)
							</p>
						</li>
						<li>
							<p>
								la taille moyenne d&apos;un foyer était de 2.16 personnes en
								2021&nbsp;
								<a
									href='https://www.insee.fr/fr/statistiques/2381486'
									rel='noopener noreferrer nofollow'
								>
									selon l&apos;Insee
								</a>
							</p>
						</li>
						<li>
							<p>
								si on se base sur les données de RTE (160 TWh de consommation du
								secteur résidentiel en 2019 (
								<a
									href='https://assets.rte-france.com/prod/public/2022-06/FE2050%20_Rapport%20complet_3.pdf'
									rel='noopener noreferrer nofollow'
								>
									page 100
								</a>
								&nbsp;de ce doc) et avec 29.2 millions de foyers en 2019 (source
								:&nbsp;
								<a
									href='https://www.insee.fr/fr/statistiques/6455805?sommaire=6455840&amp;geo=METRO-1'
									rel='noopener noreferrer nofollow'
								>
									insee
								</a>
								), on obtient 5 479 kWh de consommation par foyer et par an
							</p>
						</li>
					</ul>
				</>,
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					Pourquoi avoir utilisé une méthode de calcul simplifiée ?
				</h3>,
				<>
					<p>
						Le choix d’une méthode de calcul simplifiée répond à plusieurs objectifs :
					</p>
					<ul>
						<li>
							<p>
								<strong>Éco-conception et sobriété numérique</strong>
								<br />
								En limitant la complexité des calculs, nous réduisons la
								consommation de ressources informatiques et l’empreinte carbone liée
								au traitement des données.
							</p>
						</li>
						<li>
							<p>
								<strong>
									Limites structurelles et réglementaires difficiles à intégrer à
									grande échelle
								</strong>
								<br />
								Au-delà des aspects de forme des toits, de nombreux autres facteurs
								influencent la faisabilité réelle d’un projet d’installation de
								panneaux solaires :
							</p>
							<ul>
								<li>
									<p>les ombres des bâtiments &amp; végétations adjacents</p>
								</li>
								<li>
									<p>
										la puissance de raccordement disponible sur le réseau de
										distribution (Enedis)
									</p>
								</li>
								<li>
									<p>
										la faisabilité économique : même si une grande surface est
										exploitable, il est possible que des panneaux soient
										installés sur une surface plus petite
									</p>
								</li>
								<li>
									<p>
										la validation des Architectes des Bâtiments de France (ABF)
										si l’établissement est proche d’un bâtiment protégé
									</p>
								</li>
								<li>
									<p>
										la structure du toit et sa capacité à supporter le poids
										supplémentaire des panneaux
									</p>
								</li>
								<li>
									<p>
										et bien d’autres contraintes techniques ou administratives.
									</p>
								</li>
							</ul>
						</li>
						<li>
							<p>
								<strong>Accessibilité et transparence</strong>
								<br />
								Nous souhaitons fournir une information claire, compréhensible et
								facilement interprétable par tous : citoyens, élus, journalistes,
								professionnels ou simples curieux. Une méthode simplifiée permet de
								rendre les résultats accessibles sans nécessiter de connaissances
								techniques pointues.
							</p>
						</li>
						<li>
							<p>
								<strong>Couverture nationale et comparabilité</strong>
								<br />
								Cette approche permet de traiter rapidement l’ensemble du territoire
								et d’assurer une homogénéité des résultats, facilitant ainsi la
								comparaison entre établissements et entre territoires.
							</p>
						</li>
						<li>
							<p>
								<strong>Actualisation régulière</strong>
								<br />
								La simplicité de la méthode permettrait de mettre à jour les
								résultats facilement.
							</p>
						</li>
						<li>
							<p>
								<strong>Sensibilisation et action</strong>
								<br />
								L’objectif principal est de sensibiliser le grand public et les
								décideurs au potentiel du solaire dans les écoles, et d’encourager
								la réflexion et l’action en faveur de la transition énergétique.
							</p>
						</li>
					</ul>
					<p>
						Bien entendu, ces estimations ne remplacent pas une étude de faisabilité
						technique détaillée, indispensable avant tout projet d’installation. Mais
						elles constituent une première étape pour visualiser le potentiel et engager
						la discussion à grande échelle.
					</p>
				</>,
			],
		},
		{
			heading: 'Web',
			id: 'section-web',
			paragraphs: [
				<h3 className='mb-2 mt-5 text-xl font-semibold'>
					L’eco-conception au cœur du projet
				</h3>,
				<>
					<h4 className='mb-2 mt-4 text-lg font-semibold'>
						Pourquoi un site éco-conçu ?
					</h4>
					<p>
						Pour accompagner la démarche de Greenpeace, visant une utilisation par les
						collectivités publiques des énergies renouvelables, et ce de manière plus
						responsable (avec une sobriété énergétique, comme le préconise par exemple
						le scénario NégaWatt), la réalisation de l’outil Établissement solaire a
						pris en compte un certain nombre de critères d’éco-conception (pour la
						plupart issus du RGESN). Ceci afin de limiter l’impact énergétique et
						carbone de cet outil numérique.
						<br />
						Ce choix de conception intervient à tous les niveaux, nous l’avons vu pour
						la partie Data, avec l’utilisation d’une méthode de calcul simplifié. C’est
						aussi le cas au niveau de la conception web (UX-UI-Front end)
					</p>
				</>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Critères mis en place</h4>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>Mobile first</h5>
					<p>
						En prenant le format mobile comme base de conception, nous ne nous
						focalisons que sur l’essentiel et développons des composants plus facilement
						réutilisables permettant une économie de moyens.
					</p>
				</>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>Composants et animations</h5>
					<p>
						L’utilisation d’icônes et de fonds de carte vectoriels diminuent le poids de
						la page et permettent de meilleures performances d’affichage côté
						utilisateur. Le clustering des marqueurs d’établissement et l’affichage
						progressif des informations sur la carte, permet de réduire le nombre
						d’objets affichés lorsque celle-ci est zoomée. Les animations sont limitées
						(comme le zoom sur la carte) même si des compromis ont été fait pour
						garantir confort d’utilisation et accessibilité.
					</p>
				</>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>Parcours optimisés</h5>
					<p>
						En limitant de nombre de pages et d’écrans à afficher (pas d’entrées par
						profils cibles), le parcours de l’utilisateur est facilité tout en réduisant
						la charge du serveur.
					</p>
				</>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>Dark mode</h5>
					<p>
						L’utilisation de couleur de fonds sombres permet une économie d’énergie en
						affichant moins de zones très lumineuses comme les fonds clairs par exemple.
						Encore une fois un compromis a été choisi pour garantir une bonne lisibilité
						(notamment de jour) sur les fiches.
					</p>
				</>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>Formulaire-free</h5>
					<p>
						Nous avons fait en sorte de ne pas utiliser de formulaire pour réduire
						l’envoi de données. Des redirections mails sont par exemple utilisés à la
						place des formulaires de contact.
					</p>
				</>,
				<>
					<h5 className='mb-1 mt-3 text-base font-semibold'>
						Utilisation de police système
					</h5>
					<p>
						En utilisant une police pré-installée dans le terminal, ici Verdana,
						l’utilisateur n’a pas besoin d’en télécharger une supplémentaire, réduisant
						la consommation de la bande passante et accélérant le chargement du site.
					</p>
				</>,
				<h4 className='mb-2 mt-4 text-lg font-semibold'>Résultats</h4>,
				<>
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
					<ul>
						<li>
							<p>
								Google Lighthouse :{' '}
								<a
									href='https://pagespeed.web.dev/analysis/https-d4g-13-potentiel-solaire-services-dataforgood-fr/seoz0u0g7b?form_factor=mobile&amp;category=performance&amp;category=accessibility&amp;category=best-practices&amp;category=seo&amp;hl=fr&amp;utm_source=lh-chrome-ext'
									rel='noopener noreferrer nofollow'
								>
									https://pagespeed.web.dev/analysis/https-d4g-13-potentiel-solaire-services-dataforgood-fr/seoz0u0g7b?form_factor=mobile&amp;category=performance&amp;category=accessibility&amp;category=best-practices&amp;category=seo&amp;hl=fr&amp;utm_source=lh-chrome-ext
								</a>
								<br />
								Eco-index :{' '}
								<a
									href='https://www.ecoindex.fr/resultat/?id=9e652064-f602-4475-bea9-c83f82880dc1'
									rel='noopener noreferrer nofollow'
								>
									https://www.ecoindex.fr/resultat/?id=9e652064-f602-4475-bea9-c83f82880dc1
								</a>
							</p>
						</li>
						<li>
							<p>
								Kastor :{' '}
								<a
									href='https://kastor.green/audit-result/86f84e86-c6d4-44c8-b708-08ddf9386da9/ecodesign'
									rel='noopener noreferrer nofollow'
								>
									https://kastor.green/audit-result/86f84e86-c6d4-44c8-b708-08ddf9386da9/ecodesign
								</a>
							</p>
						</li>
					</ul>
				</>,
			],
		},
	],
};

export default notreMethodologieContent;
