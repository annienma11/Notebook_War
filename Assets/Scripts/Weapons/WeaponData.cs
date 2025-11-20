using UnityEngine;

namespace NotebookWar.Weapons
{
    [CreateAssetMenu(fileName = "WeaponData", menuName = "NotebookWar/Weapon Data")]
    public class WeaponData : ScriptableObject
    {
        public string weaponName;
        public float damage = 10f;
        public float fireRate = 0.1f;
        public float range = 100f;
        public int magazineSize = 30;
        public float reloadTime = 2f;
        public bool isAutomatic = true;
        public float recoil = 1f;
    }
}
