/* eslint-disable react/jsx-key */
import type { StaticPageProps } from '../components/StaticPage';

const linkStyle =
	'text-green underline decoration-dotted decoration-2 underline-offset-4 transition hover:decoration-solid';

/**
 * Content for "Mentions légales" page
 * Reminder :
 * - heading properties are turned into h2 by StaticPage component
 * - paragraphs keys are handled in StaticPage component
 */
const mentionsLegalesContent: StaticPageProps = {
	title: 'Mentions légales',
	sections: [
		{
			heading: 'Le Site est édité par :',
			id: 'section-editeur-du-site',
			paragraphs: [
				<section aria-labelledby='section-editeur-du-site'>
					<p>Dénomination sociale : Greenpeace France</p>
					<p>Forme juridique :</p>
					<p>RCS :</p>
					<p>Siège :</p>
					<p>Numéro de téléphone :</p>
					<p>Adresse email :</p>
				</section>,
			],
		},
		{
			paragraphs: [
				<p className='mt-8'>
					Directeur de la publication : Jean-François Julliard, directeur général
					Greenpeace France
				</p>,
			],
		},
		{
			heading: 'Le Site est hébergé par :',
			id: 'section-hebergeur-du-site',
			paragraphs: [
				<section aria-labelledby='section-hebergeur-du-site'>
					<p>Dénomination sociale :</p>
					<p>Forme juridique :</p>
					<p>RCS :</p>
					<p>Siège :</p>
					<p>Numéro de téléphone :</p>
				</section>,
			],
		},
		{
			paragraphs: [
				<h2 className='sr-only' id='section-introduction'>
					Introduction
				</h2>,
				<section className='space-y-4' aria-labelledby='section-introduction'>
					<p>
						Les mentions légales qui suivent s’appliquent à tout internaute visitant ces
						sites, seule la version française faisant foi. Nous vous remercions d’en
						prendre connaissance attentivement avant tout accès aux pages contenues dans
						ce site.
					</p>
					<p>
						Ce Site a été créé par Greenpeace et les informations regroupées dans ce
						Site sont destinées à une présentation institutionnelle des activités de
						Greenpeace. Greenpeace se réserve le droit de modifier le contenu du Site à
						tout moment et sans préavis et ne pourra être tenu responsable des
						conséquences de telles modifications. L’accès et l’utilisation de ce Site
						sont soumis aux conditions suivantes ainsi qu’aux dispositions légales en
						vigueur. En accédant au Site, vous acceptez, sans limitation ni réserves,
						ces conditions.
					</p>
				</section>,
			],
		},
		{
			heading: 'Juridiction',
			id: 'section-juridiction',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-juridiction'>
					<p className='mt-8'>
						Le Site Greenpeace et son contenu sont créés conformément aux règles
						applicables en France, même s’ils sont accessibles à des utilisateurs
						francophones et non francophones. Par ailleurs, dans le cas d’une divergence
						entre les informations présentées dans la version française du Site et les
						informations présentées dans les versions du Site traduites dans d’autres
						langues, les informations présentées dans la version française du Site
						prévalent.
					</p>
				</section>,
			],
		},
		{
			heading: 'Contenu du Site',
			id: 'section-contenu-du-site',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-liens-hypertexte'>
					<p>
						Greenpeace fournit ces informations à des fins purement informatives et
						s’efforce de contrôler la véracité des informations et de maintenir ses
						sites à jour. Cependant, aucune garantie n’est apportée concernant
						l’exactitude, la précision, la mise à jour ou l’exhaustivité des
						informations mises à la disposition sur le Site.
					</p>
					<p>
						Par conséquent et à l’exception d’une faute lourde ou intentionnelle,
						Greenpeace décline toute responsabilité pour tout dommage résultant
						notamment d’une imprécision ou inexactitude des informations disponibles sur
						notre Site ou pour toute atteinte résultant d’une intrusion frauduleuse d’un
						tiers sur notre Site avec l’intention de nuire aux intérêts ou à l’image du
						Groupe, notamment en dénaturant les informations répertoriées sur le Site.
					</p>
					<p>
						La responsabilité de Greenpeace ne saurait être retenue pour tout dommage ou
						virus qui pourrait endommager ou rendre inutilisable votre équipement
						informatique suite à la visite de notre Site malgré les actions de
						sécurisation mises en œuvre.
					</p>
				</section>,
			],
		},
		{
			heading: 'Liens hypertexte',
			id: 'section-liens-hypertexte',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-liens-hypertexte'>
					<p>
						Afin de faciliter l’accès à d’autres sites susceptibles d’apporter un
						complément d’information, Greenpeace a inséré dans le Site un certain nombre
						de liens hypertexte. Néanmoins, la responsabilité de Greenpeace ne saurait
						être engagée au titre d’un site tiers auquel vous auriez eu accès via notre
						Site et présentant des contenus litigieux ou inexacts. Greenpeace ne dispose
						d’aucun moyen de contrôle des contenus des sites tiers.
					</p>
					<p>
						Par ailleurs, des sites externes peuvent contenir des liens hypertextes
						pointant vers notre Site, Greenpeace n’a aucun moyen légal de s’opposer à
						cette pratique usitée dans Internet et ne saurait en aucun cas être tenu
						pour responsable de contenus issus de sites externes à Greenpeace.
					</p>
				</section>,
			],
		},
		{
			heading: 'Propriété intellectuelle',
			id: 'section-propriete-intellectuelle',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-propriete-intellectuelle'>
					<p>
						Toutes les images, marques, logos, noms de domaine et information sous forme
						de texte ou d’image présents sur le Site sont la propriété de Greenpeace ou
						font l’objet d’une autorisation d’utilisation qui est décrite dans la page
						Crédits Photo. Toute utilisation par reproduction, modification,
						téléchargement, transmission ou autre procédé existant présent ou futur est
						soumise à autorisation écrite préalable (courrier, mail, fax). Seules les
						copies à usage privé et non-commercial sont autorisées sous réserve des
						droits de propriété intellectuelle dont il est fait mention. La reprise
						d’articles ou de reportages présents dans un de nos sites est également
						soumise à autorisation et devra porter une mention « ©Greenpeace » ou selon
						les droits cités dans la source. Tout contrevenant s’expose à des poursuites
						judiciaires.
					</p>
					<p>
						Par ailleurs, des sites externes peuvent contenir des liens hypertextes
						pointant vers notre Site, Greenpeace n’a aucun moyen légal de s’opposer à
						cette pratique usitée dans Internet et ne saurait en aucun cas être tenu
						pour responsable de contenus issus de sites externes à Greenpeace.
					</p>
				</section>,
			],
		},
		{
			heading: 'Données personnelles',
			id: 'section-donnees-personnelles',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-donnees-personnelles'>
					<p>
						<em>
							Greenpeace pense que le respect de votre vie privée sur le web est un
							droit fondamental, c’est pourquoi nous veillons à garantir votre
							sécurité en ligne aussi rigoureusement que possible.
						</em>
					</p>
					<p>
						Cette politique concerne toutes les pages hébergées sur les sites de
						Greenpeace France. Elle ne s’applique pas aux pages hébergées par d’autres
						organisations vers lesquelles nous pouvons établir des liens, et dont les
						politiques en matière de respect de la vie privée peuvent être différentes.
					</p>
					<p>
						Afin d’améliorer la navigation au sein de ses Sites, Greenpeace recueille au
						cours de la visite certaines données via le dépôt et la lecture de traceurs
						appelés cookies que les personnes concernées ont la possibilité de
						paramétrer grâce au paramétrage de cookies disponible sur le site.
					</p>
					<p>
						En savoir plus sur les données personnelles (lien vers la politique de
						protection des données personnelles){' '}
						<a
							href='https://www.greenpeace.fr/mentions-legales/droits-des-personnes/'
							target='_blank'
							rel='noopener noreferrer'
							className={linkStyle}
						>
							ici
						</a>
						.
					</p>
					<p>
						Chaque personne concernée dispose de droits d’accès, de rectification,
						d’effacement, de limitation et de portabilité ainsi qu’un droit d’opposition
						qu’elle peut exercer en contactant le Délégué à la protection des données
						personnelles de Greenpeace : dpd@greenpeace.fr.
					</p>
				</section>,
			],
		},
		{
			heading: 'Hébergement',
			id: 'section-hebergement',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-hebergement'>
					<p>
						Notre site est hébergé sur un serveur qui est situé chez un hébergeur dont
						la politique de respect de la vie privée est identique à la nôtre. Les
						informations figurant sur les « logs » de nos sites ne permettent pas
						l’identification des personnes, et nous n’essayons en aucune manière
						d’associer ces informations aux personnes qui visitent le site. Le serveur
						recueille des informations sur les dates et heures d’accès à notre site web
						ainsi que sur l’adresse Internet (IP) du terminal (ordinateur, smartphone,
						tablette, etc.) à partir duquel vous avez accédé à notre site. Nous pouvons
						ainsi suivre, anonymement, la navigation d’un utilisateur à l’intérieur de
						notre site. Nous nous servons de ces informations pour améliorer le contenu
						et l’ergonomie de notre site et établir des statistiques de fréquentation.
					</p>
				</section>,
			],
		},
		{
			heading: 'Cookies',
			id: 'section-cookies',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-cookies'>
					<p>
						Vous pouvez consulter notre politique de cookies{' '}
						<a
							href='https://www.greenpeace.fr/politique-de-cookies/'
							target='_blank'
							rel='noopener noreferrer'
							className={linkStyle}
						>
							ici
						</a>
						.
					</p>
				</section>,
			],
		},
		{
			heading: 'Protocole TLS/SSL',
			id: 'section-tls-ssl',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-tls-ssl'>
					<p>
						Le site http://etablissement-solaire.fr/ utilise le protocole TLS (Transpot
						Layer Security), un protocole de sécurité qui permet à vos communications
						par Internet de rester privées. Ce protocole offre des applications pour les
						clients/serveurs permettant de communiquer sans être écouté-e de façon
						indiscrète, sans que vos messages soient modifiés. Il crypte toutes les
						informations personnelles (nom, adresse, email…) lors de leur transit entre
						le navigateur et nos serveurs, afin que ces informations ne puissent pas
						être lues quand elles circulent sur Internet. Quand vous êtes sur une page
						sécurisée, le cadenas apparaît en icône dans la barre d’adresse.
					</p>
					<p>
						Si nous utilisons le cryptage TLS pour protéger les informations sensibles
						sur Internet, nous faisons également tout notre possible pour protéger ces
						informations une fois stockées. Tous nos disques durs sont cryptés en amont
						du système d’exploitation. Si, d’aventure, une machine était dérobée, les
						données stockées sur les disques durs resteraient inaccessibles.
					</p>
				</section>,
			],
		},
		{
			heading: 'Autres informations',
			id: 'section-autres-informations',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-autres-informations'>
					<p>
						Directeur de la publication : Jean-François Julliard, directeur général
						Greenpeace France
					</p>
					<p>
						Si vous avez des questions sur les informations que nous gardons sur les
						utilisateurs et utilisatrices du site, veuillez contacter dpd@greenpeace.fr.
					</p>
					<p>
						Nos mesures de sécurité et cette politique sont réévaluées régulièrement.
						Vous pouvez adresser toute question concernant cette politique à :
					</p>
					<address>
						Responsable site web
						<br />
						Greenpeace France
						<br />
						13, rue d’Enghien
						<br />
						75010 Paris
					</address>
				</section>,
			],
		},
		{
			heading: 'Droits des personnes',
			id: 'section-droits-des-personnes',
			paragraphs: [
				<section className='space-y-4' aria-labelledby='section-droits-des-personnes'>
					<p>
						Greenpeace France est attaché au respect de la protection des données
						personnelles et de la vie privée des personnes avec lesquelles l’association
						interagit et, à ce titre, vous invite à prendre connaissance de sa politique
						de protection des données{' '}
						<a
							href='https://www.greenpeace.fr/politique-de-protection-des-donnees/'
							target='_blank'
							rel='noopener noreferrer'
							className={linkStyle}
						>
							ici
						</a>
						.
					</p>
				</section>,
			],
		},
	],
};

export default mentionsLegalesContent;
