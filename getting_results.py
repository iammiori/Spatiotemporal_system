from flask import Flask, render_template,flash,request
import os
from os import listdir
from os.path import isfile, join
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from pathlib import Path
import pandas as pd
import numpy as np
import pysal as ps
import json
import pickle
from lib import toimage
from lib_getting_results import get_result_temporal,get_result_convlstm,grid_to_img,getting_spatial_autocorr
from scipy.stats import zscore

app = Flask(__name__)

select=''
sf=[]
sfa = ''

@app.route("/")
def start():
	data=getting_data_scatter()
	return render_template("layout.html",data=data)


@app.route("/",methods=['GET','POST'])
def index():
    
    global select
    global sf
    global sl
    global sfa

    if request.method == 'POST':

        sm = request.form.getlist('model')
        sf = request.form.getlist('feature')
        sd = request.form['trip-start']
        sl = request.form['lag']
        sfa = request.form['feature_a']

        for a in sm:
            if a=='lstm':
                select = 'lstm'
            elif a=='gru':
                select = 'gru'
            elif a=="convlstm":
                select = 'convlstm'
        print(sf)


        data=getting_data_scatter()

        sfa = str(sfa)
        #####################
        ####input############
        time_lag=int(sl)#6
        features = sf#['pm10','pm25']#features = request.form['features']
        models = select#request.form.getlist('model') #lstm
        #print(models)
        interpolations ='nearest'# request.form.getlist('interpolation')
        form_predict_date = sd#'2019-09-10'#request.form['trip-start']
        form_predict_hour=13#0~23
        #####################
        #####################

        f_dict={'humi':0,'noise':1,'pm10':2,'pm25':3,'temp':4}
        m_dict={'lstm':0,'gru':1,'convlstm':2}
        idx=[f_dict[i] for i in features]
        idx.sort();idx=tuple(idx)

        idx2 = f_dict[sfa]
        auto_url = "data/autocorr/Output" + str(idx2) + ".json"
        autocorrelations = get_autocorrelation(auto_url)
        moran = get_moranslist()

        if models=="convlstm":
        	results_list=get_result_convlstm(idx,models,form_predict_date,form_predict_hour,time_lag)
        else:
        	results_list=get_result_temporal(idx,models,form_predict_date,form_predict_hour,time_lag)
        acc=results_list[0]
        array_pred,array_true,array_res,array_sd=results_list[1]
        grid_pred,grid_true,grid_res,grid_sd=results_list[2]
        #result -> save image and getting url
        pred_url=grid_to_img(grid_pred,interpolations,'CMRmap','pred',45)
        true_url=grid_to_img(grid_true,interpolations,'CMRmap','true',45)
        res_url=grid_to_img(grid_res,interpolations,'Greys_r','res',50)
        sd_url=grid_to_img(grid_sd,interpolations,'BuPu_r','sd',50)
        #result -> save lisa image and getting url
        mi_true,mi_p_true,lisa_url_true=getting_spatial_autocorr(array_true,"true")
        mi_pred,mi_p_pred,lisa_url_pred=getting_spatial_autocorr(array_pred,"pred")
        #print
        print("acc: ",acc)
        print("mi_true: ",mi_true)
        print("mi_pred: ",mi_pred)

        file_name = ["df_pred","df_true"]
        for i in file_name:
            #if (i=="df_pred"):
            file_path = "static/results/" + i + ".csv"
            df = pd.read_csv(file_path)
            outlier_row = (abs(df.apply(zscore))>3)
            df[outlier_row] = np.nan
            df.fillna(df.quantile((.5),axis=0),inplace=True)
            df_bp = df.quantile([.0,.25,.5,.75,.99],axis=0)
            df_bpt = df_bp.T.to_numpy()

            if (i=="df_pred"):
                box_data_p = json.dumps(df_bpt.tolist(),indent=2)

            else:
                box_data_o = json.dumps(df_bpt.tolist(),indent=2)   

            #box_data_p = json.dumps(df_bpt.tolist(),indent=2)
        '''
        else:
            file_path = "static/results/" + i + ".csv"
            df = pd.read_csv(file_path)
            outlier_row = (df.apply(zscore)>3)
            df[outlier_row] = np.nan
            df.fillna(df.quantile((.5),axis=0),inplace=True)
            df_bp = df.quantile([.0,.25,.5,.75,1.0],axis=0)
            df_bpt = df_bp.T.to_numpy()
            box_data_o = json.dumps(df_bpt.tolist(),indent=2)
            '''
         
         	

    return render_template('layout.html',data1=box_data_p,data2=box_data_o,data3=autocorrelations,data4=moran,data=data)


def get_autocorrelation(filepath):
    with open(filepath) as json_file:
        json_data = json.load(json_file)

        json_keys = json_data[0].keys()
        keys = [key for key in json_keys]
        keys.pop(0)

        dictionaries = []
        for variable in keys:
            data = list(map(lambda x: x[variable], json_data))
            dictionary = {
                'name': variable,
                'data': data
            }
            dictionaries.append(dictionary)

    return dictionaries

def getting_data_scatter():
    df = pd.read_csv("data/04_10558.csv", sep='|', engine='python',header=None)
    df.columns = ['date', 'sensor','flag','pm10','co2','vocs','noise','temp','humi','co','hcho','pm25','n']
    df=df.drop(['flag','co2','vocs','co','hcho','n'], axis=1)
    df=df.dropna()
    df_corr = df.iloc[:,[2,3,4,5,6]].corr(method='pearson')
    df_corr = df_corr.to_dict(orient='records')
    df_corr = json.dumps(df_corr,indent=2)
    #scatter data
    tmpc=pd.Series(['a', 'b', 'c','d'])
    tmpc=tmpc.repeat(360)
    tmpc=tmpc[:df.shape[0]]
    df['sepcolor'] = tmpc.values
    chart_data = df.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data': chart_data, 'df_corr':df_corr}

    return data


def get_path(directory):
    path = os.path.dirname(os.path.realpath(__file__))
    path = Path(path).parent
    path = str(path) + "\\" + directory + "\\"
    return path

def is_result_exists(filename):
    path = get_path("vis_system/results") + filename
    return True if os.path.isfile(path) else False



def get_moranslist():
    if is_result_exists("moranslist.pickle"):
        with open(get_path("vis_system/results") +"moranslist.pickle", 'rb') as handle:
            return pickle.load(handle)

    location = pd.read_csv('data/moranslist/location_seoul_413.csv')
    location['no'] = location['no'].astype(str)
    array = np.load('data/moranslist/array_413.npy')

    points = [(location['lat'][i], location['long'][i]) for i in range(location.shape[0])]
    kernel = ps.lib.weights.Kernel(points, fixed=False, function='gaussian')

    names = ['Humidity', 'Noise', 'PM10', 'PM2.5', 'Temperature']
    dictionaries = []
    for index in range(5):
        moran_array = []
        for t in range(1800):
            if np.isnan(array[t, 0, index]): continue
            y = array[t, :, index]
            moran_i = ps.explore.esda.Moran(y, kernel, two_tailed=False)
            moran_array.append(moran_i.I)
        dictionary = {
            'name': names[index],
            'data': moran_array
        }
        dictionaries.append(dictionary)

    with open(get_path("vis_system/results") + "moranslist.pickle", "wb") as fw:
        pickle.dump(dictionaries, fw)

    return dictionaries


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug=True,use_reloader=False)

#127.0.0.1