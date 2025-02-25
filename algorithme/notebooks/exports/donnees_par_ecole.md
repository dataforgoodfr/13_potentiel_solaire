```python
import geopandas as gpd
from pathlib import Path
import matplotlib.pyplot as plt
import contextily as cx
import fiona 
import numpy as np
# Potentiel solaire package
from potentiel_solaire.constants import DATA_FOLDER
```


```python
# Verification des layers disponibles
stdenis_path = DATA_FOLDER / "saint_denis_reference_data.gpkg"
layers = fiona.listlayers(stdenis_path)
print(" ".join(layers))
```

    annuaire_education annuaire_education_sans_zone bdtopo_education bdtopo_batiment cadastre_parcellaire potentielsolaire_bati potentielsolaire_toitures identifiers


## On ouvre le jeu de données préparé


```python
# On ouvre une zone
ID = 6
stdenis = gpd.read_file(stdenis_path, layer="bdtopo_education")# toponymie_services_et_activites
stdenis = stdenis.to_crs(2154) # 2154 Lambert, 4326 latlon  
example = stdenis[ID:ID+1]
ID = example["cleabs_left"].iloc[0]
NOM = example["toponyme"].iloc[0]
# On ouvre les toitures
toiture = gpd.read_file(stdenis_path, layer="bdtopo_batiment")# toponymie_services_et_activites
toiture_b = gpd.read_file(stdenis_path, layer="potentielsolaire_bati")# toponymie_services_et_activites
toiture_t = gpd.read_file(stdenis_path, layer="potentielsolaire_toitures")# toponymie_services_et_activites
toiture_c = gpd.read_file(stdenis_path, layer="cadastre_parcellaire")# toponymie_services_et_activites

toiture = toiture.to_crs(2154) # 2154 Lambert, 4326 latlon  
toiture_b = toiture.to_crs(2154)
toiture_t = toiture.to_crs(2154)
toiture_c = toiture.to_crs(2154)
toiture = gpd.sjoin(toiture, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri').clip(example)
toiture_b = gpd.sjoin(toiture_b, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri').clip(example)
toiture_t = gpd.sjoin(toiture_t, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri').clip(example)
toiture_c = gpd.sjoin(toiture_c, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri').clip(example)
```


```python
fig, ax = plt.subplots()

example.plot(ax=ax, alpha=0.7, color ="green")
toiture_c.plot(ax=ax, alpha=0.7, color ="pink")
toiture_t.plot(ax=ax, alpha=0.7, color ="yellow")
toiture_b.plot(ax=ax, alpha=0.7, color ="orange")
toiture.plot(ax=ax, alpha=0.7, color ="red")


cx.add_basemap(ax, crs=example.crs)
fig.show()
```

    /tmp/ipykernel_273204/1044144719.py:11: UserWarning: FigureCanvasAgg is non-interactive, and thus cannot be shown
      fig.show()



    
![png](donnees_par_ecole_files/donnees_par_ecole_4_1.png)
    


# Exploration MNS liées aux zones


```python
import rasterio
import rasterio.mask
import os
from rasterio.plot import show
```

## On recadre l'image


```python
geotiff_cached = "../data/cache/mns/"+ID+".masked.tif"
os.makedirs("../data/cache/mns", exist_ok=True)

if not os.path.isfile(geotiff_cached):
    geome = example.geometry.total_bounds
    A = "0"+str(int(geome[0]//1000))
    B = str(int(geome[1]//1000)+1)
    tile = "/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01/MNS-Correl/1_DONNEES_LIVRAISON_2024-11-00179/MNS-C_0M50_TIF_LAMB93_D93-2024/93-2024-"+A+"-"+B+"-LA93-0M50.tif"
    path = DATA_FOLDER / tile
    with rasterio.open("../data/"+str(path)) as img:
        out_image, out_transform = rasterio.mask.mask(img, example.geometry, crop=True)
        out_meta = img.meta
    minval = np.min(out_image[np.nonzero(out_image)])
    out_image = out_image - minval

    out_image = np.where(out_image<0, 0, out_image)
    out_meta.update({"driver": "GTiff",
                    "height": out_image.shape[1],
                    "width": out_image.shape[2],
                    "transform": out_transform})

    with rasterio.open("../data/cache/mns/"+ID+".masked.tif", "w", **out_meta) as dest:
        dest.write(out_image)
```

## Et on la représente


```python
img_ecole = rasterio.open("../data/cache/mns/"+ID+".masked.tif")

fig, ax = plt.subplots(figsize=(10,10))



show(img_ecole, ax=ax, alpha=0.9)
example.plot(ax=ax, alpha=0.7, linewidth=2, facecolor="none", edgecolor='pink')
toiture_c.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='green')
toiture.plot(ax=ax, alpha=0.7, linewidth=4,facecolor="none", edgecolor='red', label="batiments")
toiture_t.plot(ax=ax, alpha=0.7, linewidth=2,facecolor="none", edgecolor='orange')
toiture_b.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='yellow')


cx.add_basemap(ax, crs=example.crs, alpha=0.5, source=cx.providers.GeoportailFrance.orthos )


plt.title("Exploitation MNS pour :"+ NOM+"\n"+ID+"\n")
fig.show()


```

    /tmp/ipykernel_273204/2591723346.py:19: UserWarning: FigureCanvasAgg is non-interactive, and thus cannot be shown
      fig.show()



    
![png](donnees_par_ecole_files/donnees_par_ecole_10_1.png)
    


# Focalisation sur les batiments


```python
geotiff_cached_toits = "../data/cache/mns/"+ID+"_toits.masked.tif"

if not os.path.isfile(geotiff_cached_toits) or True:
    geome = example.geometry.total_bounds
    A = "0"+str(int(geome[0]//1000))
    B = str(int(geome[1]//1000)+1)
    tile = "/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01/MNS-Correl/1_DONNEES_LIVRAISON_2024-11-00179/MNS-C_0M50_TIF_LAMB93_D93-2024/93-2024-"+A+"-"+B+"-LA93-0M50.tif"
    path = DATA_FOLDER / tile
    with rasterio.open("../data/"+str(path)) as img:
        out_image, out_transform = rasterio.mask.mask(img, toiture.geometry, crop=True)
        out_meta = img.meta
    minval = np.min(out_image[np.nonzero(out_image)])
    out_image = out_image - minval

    out_image = np.where(out_image<0, 0, out_image)

    MAX = np.percentile(out_image[np.nonzero(out_image)],80)
    out_image = np.where(out_image>=MAX, MAX, out_image)

    out_meta.update({"driver": "GTiff",
                    "height": out_image.shape[1],
                    "width": out_image.shape[2],
                    "transform": out_transform})

    with rasterio.open(geotiff_cached_toits, "w", **out_meta) as dest:
        dest.write(out_image)
```


```python
img_ecole = rasterio.open(geotiff_cached_toits)

fig, ax = plt.subplots(figsize=(10,10))

show(img_ecole, ax=ax, alpha=0.8)

example.plot(ax=ax, alpha=0.7, linewidth=2, facecolor="none", edgecolor='pink')
# A explorer peut etre: cx.providers.GeoportailFrance
cx.add_basemap(ax, crs=example.crs, alpha=0.6, source=cx.providers.GeoportailFrance.orthos )
toiture_c.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='green')
toiture.plot(ax=ax, alpha=0.7, linewidth=4,facecolor="none", edgecolor='red')
toiture_t.plot(ax=ax, alpha=0.7, linewidth=2,facecolor="none", edgecolor='orange')
toiture_b.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='yellow')


plt.title("Exploitation MNS pour :"+ NOM+"\n"+ID+"\n")
fig.show()
```

    /tmp/ipykernel_273204/779259189.py:17: UserWarning: FigureCanvasAgg is non-interactive, and thus cannot be shown
      fig.show()



    
![png](donnees_par_ecole_files/donnees_par_ecole_13_1.png)
    


# Et sur toutes les écoles


```python
stdenis = gpd.read_file(stdenis_path, layer="bdtopo_education")# toponymie_services_et_activites
stdenis = stdenis.to_crs(2154) # 2154 Lambert, 4326 latlon  
```


```python
toiturefull = gpd.read_file(stdenis_path, layer="bdtopo_batiment")# toponymie_services_et_activites
toiture_bfull = gpd.read_file(stdenis_path, layer="potentielsolaire_bati")# toponymie_services_et_activites
toiture_tfull = gpd.read_file(stdenis_path, layer="potentielsolaire_toitures")# toponymie_services_et_activites
toiture_cfull = gpd.read_file(stdenis_path, layer="cadastre_parcellaire")# toponymie_services_et_activites
toiturefull = toiturefull.to_crs(2154) # 2154 Lambert, 4326 latlon  
toiture_bfull = toiture_bfull.to_crs(2154)
toiture_tfull = toiture_tfull.to_crs(2154)
toiture_cfull = toiture_cfull.to_crs(2154)
```


```python
OnVeutRefaireTousLesToits = True
if OnVeutRefaireTousLesToits:
    for ID in range(len(stdenis)-1):
        example = stdenis[ID:ID+1]
        ID = example["cleabs_left"].iloc[0]
        NOM = example["toponyme"].iloc[0]
        print(ID)

        toiture = gpd.sjoin(toiturefull, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri')
        toiture_b = gpd.sjoin(toiture_bfull, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri')
        toiture_t = gpd.sjoin(toiture_tfull, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri')
        toiture_c = gpd.sjoin(toiture_cfull, example, how='inner', predicate='intersects',lsuffix='_li', rsuffix='_ri')
        geotiff_cached = "../data/cache/mns/"+ID+".masked.tif"
        try:

            if not os.path.isfile(geotiff_cached):
                geome = example.geometry.total_bounds
                A = "0"+str(int(geome[0]//1000))
                B = str(int(geome[1]//1000)+1)
                tile = "/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01/MNS-Correl/1_DONNEES_LIVRAISON_2024-11-00179/MNS-C_0M50_TIF_LAMB93_D93-2024/93-2024-"+A+"-"+B+"-LA93-0M50.tif"
                path = DATA_FOLDER / tile
                with rasterio.open("../data/"+str(path)) as img:
                    out_image, out_transform = rasterio.mask.mask(img, example.geometry, crop=True)
                    out_meta = img.meta
                minval = np.min(out_image[np.nonzero(out_image)])
                out_image = out_image - minval

                out_image = np.where(out_image<0, 0, out_image)
                out_meta.update({"driver": "GTiff",
                                "height": out_image.shape[1],
                                "width": out_image.shape[2],
                                "transform": out_transform})

                with rasterio.open("../data/cache/mns/"+ID+".masked.tif", "w", **out_meta) as dest:
                    dest.write(out_image)


            geotiff_cached_toits = "../data/cache/mns/"+ID+"_toits.masked.tif"

            if not os.path.isfile(geotiff_cached_toits) or True:
                geome = example.geometry.total_bounds
                A = "0"+str(int(geome[0]//1000))
                B = str(int(geome[1]//1000)+1)
                tile = "/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01/MNS-Correl/1_DONNEES_LIVRAISON_2024-11-00179/MNS-C_0M50_TIF_LAMB93_D93-2024/93-2024-"+A+"-"+B+"-LA93-0M50.tif"
                path = DATA_FOLDER / tile
                with rasterio.open("../data/"+str(path)) as img:
                    out_image, out_transform = rasterio.mask.mask(img, toiture.geometry, crop=True)
                    out_meta = img.meta
                minval = np.min(out_image[np.nonzero(out_image)])
                out_image = out_image - minval

                out_image = np.where(out_image<0, 0, out_image)

                MAX = np.percentile(out_image[np.nonzero(out_image)],80)
                out_image = np.where(out_image>=MAX, MAX, out_image)

                out_meta.update({"driver": "GTiff",
                                "height": out_image.shape[1],
                                "width": out_image.shape[2],
                                "transform": out_transform})

                with rasterio.open(geotiff_cached_toits, "w", **out_meta) as dest:
                    dest.write(out_image)


            img_ecole = rasterio.open(geotiff_cached_toits)

            fig, ax = plt.subplots(figsize=(10,10))

            show(img_ecole, ax=ax, alpha=0.8)

            example.plot(ax=ax, alpha=0.7, linewidth=2, facecolor="none", edgecolor='pink')
            # A explorer peut etre: cx.providers.GeoportailFrance 
            cx.add_basemap(ax, crs=example.crs, alpha=0.6, source=cx.providers.GeoportailFrance.orthos )
            toiture_c.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='green')
            toiture.plot(ax=ax, alpha=0.7, linewidth=4,facecolor="none", edgecolor='red')
            toiture_t.plot(ax=ax, alpha=0.7, linewidth=2,facecolor="none", edgecolor='orange')
            toiture_b.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='yellow')


            plt.title("Exploitation MNS pour :"+ NOM+"\n"+ID+"\n")
            os.makedirs("../data/cache/mns/jpg", exist_ok=True)
            plt.savefig("../data/cache/mns/jpg/"+ID+".jpg", bbox_inches='tight')
            #fig.show()
        except:
            print("Error with",ID)
```

    SURFACTI0000002008347523
    SURFACTI0000002004154763
    SURFACTI0000000002555657
    SURFACTI0000000244242426
    SURFACTI0000000002555598
    SURFACTI0000000002555605
    SURFACTI0000000002555648
    SURFACTI0000000002555609
    SURFACTI0000000351259092
    SURFACTI0000000002555754
    SURFACTI0000000002555658
    SURFACTI0000000002555601
    SURFACTI0000002004251777
    SURFACTI0000000002555608
    SURFACTI0000000002555707
    SURFACTI0000002008347531
    SURFACTI0000000002555599
    SURFACTI0000000002555607
    SURFACTI0000000002555705
    SURFACTI0000000246200187
    SURFACTI0000000002555814


    /tmp/ipykernel_273204/1118725668.py:68: RuntimeWarning: More than 20 figures have been opened. Figures created through the pyplot interface (`matplotlib.pyplot.figure`) are retained until explicitly closed and may consume too much memory. (To control this warning, see the rcParam `figure.max_open_warning`). Consider using `matplotlib.pyplot.close()`.
      fig, ax = plt.subplots(figsize=(10,10))


    SURFACTI0000000002555612
    SURFACTI0000000292371018
    SURFACTI0000000002555649
    SURFACTI0000000002555600
    SURFACTI0000000245007044
    SURFACTI0000000002555708
    SURFACTI0000000246200206
    SURFACTI0000002009952162


    /tmp/ipykernel_273204/1118725668.py:78: UserWarning: The GeoDataFrame you are attempting to plot is empty. Nothing has been displayed.
      toiture_b.plot(ax=ax, alpha=0.7, linewidth=3,facecolor="none", edgecolor='yellow')


    SURFACTI0000000002555647
    SURFACTI0000000002555615
    SURFACTI0000000246200205
    SURFACTI0000000244379142


    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/contextily/tile.py:645: UserWarning: The inferred zoom level of 22 is not valid for the current tile provider (valid zooms: 0 - 21).
      warnings.warn(msg)


    SURFACTI0000000002555552
    SURFACTI0000000315148819
    SURFACTI0000000339245692
    SURFACTI0000000002555603
    SURFACTI0000000002555655
    SURFACTI0000000002555602
    SURFACTI0000000002555596
    SURFACTI0000000337484984
    SURFACTI0000000246200139
    SURFACTI0000000002555660
    SURFACTI0000000292487627
    SURFACTI0000000002555755
    SURFACTI0000000315148807
    SURFACTI0000000002555706
    SURFACTI0000000002555554



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_7.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_8.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_9.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_10.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_11.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_12.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_13.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_14.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_15.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_16.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_17.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_18.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_19.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_20.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_21.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_22.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_23.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_24.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_25.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_26.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_27.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_28.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_29.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_30.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_31.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_32.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_33.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_34.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_35.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_36.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_37.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_38.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_39.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_40.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_41.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_42.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_43.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_44.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_45.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_46.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_47.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_48.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_49.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_50.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_51.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_52.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_53.png)
    



    
![png](donnees_par_ecole_files/donnees_par_ecole_17_54.png)
    

