export const IOS_DISMISS_KEY = "pf:ios-banner";
export const FAV_TIP_KEY = "pf:fav-tip";
export const FAVORITES_KEY = "pf:favorites";

/**
 * Posé dans le <head> : les blocs qui dépendent du navigateur (iOS, favoris en
 * localStorage) sont toujours rendus par le serveur, et ce script décide avant
 * la première peinture lesquels s'affichent (data-install / data-favtip +
 * règles de globals.css) — aucun décalage de mise en page après hydratation.
 */
export const CLIENT_FLAGS_SCRIPT = `(function(){try{
var d=document.documentElement,s=null;
try{s=localStorage}catch(e){}
var g=function(k){try{return s&&s.getItem(k)}catch(e){return null}};
var ua=navigator.userAgent;
var alone=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
var ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
d.dataset.install=!alone&&ios&&g("${IOS_DISMISS_KEY}")!=="1"?"ios":"";
var fav=g("${FAVORITES_KEY}");
d.dataset.favtip=s&&g("${FAV_TIP_KEY}")!=="1"&&!(fav&&fav!=="[]")?"1":"";
}catch(e){}})()`;

/** Masque un bloc décidé avant peinture (clic « ne plus montrer »). */
export function clearFlag(flag: "install" | "favtip"): void {
  document.documentElement.dataset[flag] = "";
}
